// lib/services/external/base-external-service.ts
import { and, eq, sql } from "drizzle-orm";

import db from "@/db";
import {
  externalAthleteIds,
  externalSyncLogs,
  externalSystemsConfig,
  playerInformation,
} from "@/db/schema";

import {
  BaseExternalRecord,
  ExternalPlayerData,
  PlayerMatchResult,
  SyncResult,
} from "./types";

/**
 * Abstract base class for external service integrations
 *
 * @template TRawResponse - The raw API response type
 * @template TTransformedRecord - The transformed record type after processing
 * @template TConfig - The configuration type for this service
 */
export abstract class BaseExternalService<
  TRawResponse,
  TTransformedRecord extends BaseExternalRecord,
  TConfig extends { authUrl: string; apiUrl: string },
> {
  protected abstract systemName: "armcare" | "trackman" | "hittrax" | "hawkin";

  /**
   * Get configuration from environment variables
   */
  protected abstract getConfig(): TConfig;

  /**
   * Authenticate and return access token
   */
  abstract authenticate(): Promise<string>;

  /**
   * Refresh the access token
   */
  abstract refreshToken(): Promise<string>;

  /**
   * Fetch raw data from the external API
   */
  protected abstract fetchData(token: string): Promise<TRawResponse>;

  /**
   * Transform raw API response into normalized records
   */
  protected abstract transformData(rawData: TRawResponse): TTransformedRecord[];

  /**
   * Extract player identification data from a record
   */
  protected abstract extractPlayerData(
    record: TTransformedRecord
  ): ExternalPlayerData;

  /**
   * Process a single record (insert or update in database)
   */
  protected abstract processRecord(
    record: TTransformedRecord,
    syncLogId: string,
    result: SyncResult
  ): Promise<void>;

  /**
   * Match player using multiple strategies
   */
  async matchPlayer(
    externalData: ExternalPlayerData
  ): Promise<PlayerMatchResult> {
    // 1. Check existing link via external_athlete_ids (highest confidence)
    const existingLink = await db.query.externalAthleteIds.findFirst({
      where: and(
        eq(externalAthleteIds.externalSystem, this.systemName),
        eq(externalAthleteIds.externalId, externalData.externalId),
        eq(externalAthleteIds.linkingStatus, "active")
      ),
    });

    if (existingLink) {
      return {
        playerId: existingLink.playerId,
        confidence: 1.0,
        method: "external_id",
      };
    }

    // 2. Try name match (lower confidence - requires manual verification)
    if (externalData.firstName && externalData.lastName) {
      const nameMatch = await this.matchByName(
        externalData.firstName,
        externalData.lastName
      );
      // Only auto-match if confidence is very high
      // Otherwise, store as suggestion for manual review
      if (nameMatch && nameMatch.confidence > 0.95) {
        return nameMatch;
      }
    }

    // No match found
    return {
      playerId: null,
      confidence: 0,
      method: "name_match",
    };
  }

  private async matchByName(
    firstName: string,
    lastName: string
  ): Promise<PlayerMatchResult | null> {
    // Use case-insensitive database query
    const player = await db.query.playerInformation.findFirst({
      where: and(
        sql`LOWER(${playerInformation.firstName}) = LOWER(${firstName})`,
        sql`LOWER(${playerInformation.lastName}) = LOWER(${lastName})`
      ),
    });

    if (player) {
      return {
        playerId: player.id,
        confidence: 0.95,
        method: "name_match",
      };
    }

    return null;
  }

  /**
   * Main sync orchestration
   */
  async sync(): Promise<SyncResult> {
    const startTime = Date.now();
    const result: SyncResult = {
      success: false,
      recordsCreated: 0,
      recordsUpdated: 0,
      recordsSkipped: 0,
      recordsFailed: 0,
      playersMatched: 0,
      playersUnmatched: 0,
      newMatchSuggestions: 0,
      errors: [],
      duration: 0,
    };

    // Create sync log
    const [syncLog] = await db
      .insert(externalSyncLogs)
      .values({
        system: this.systemName,
        status: "running",
        startedAt: new Date().toISOString(),
        triggeredBy: "cron",
      })
      .returning();

    try {
      // 1. Authenticate
      const token = await this.authenticate();

      // 2. Fetch data
      const rawData = await this.fetchData(token);

      // 3. Transform data
      const records = this.transformData(rawData);

      // 4. Process each record
      for (const record of records) {
        try {
          await this.processRecord(record, syncLog.id, result);
        } catch (error) {
          result.recordsFailed++;
          result.errors.push({
            message: "Failed to process record",
            details: error instanceof Error ? error.message : String(error),
          });
        }
      }

      result.success = result.errors.length === 0;
      result.duration = Date.now() - startTime;

      // Update sync log
      await db
        .update(externalSyncLogs)
        .set({
          status: result.success ? "success" : "partial_success",
          completedAt: new Date().toISOString(),
          duration: result.duration,
          recordsCreated: result.recordsCreated,
          recordsUpdated: result.recordsUpdated,
          recordsSkipped: result.recordsSkipped,
          recordsFailed: result.recordsFailed,
          playersMatched: result.playersMatched,
          playersUnmatched: result.playersUnmatched,
          newMatchSuggestions: result.newMatchSuggestions,
          errors: result.errors.length > 0 ? result.errors : null,
        })
        .where(eq(externalSyncLogs.id, syncLog.id));

      // Update config status
      await db
        .update(externalSystemsConfig)
        .set({
          lastSyncAt: new Date().toISOString(),
          lastSyncStatus: result.success ? "success" : "failed",
        })
        .where(eq(externalSystemsConfig.system, this.systemName));

      return result;
    } catch (error) {
      result.errors.push({
        message: "Sync failed",
        details: error instanceof Error ? error.message : String(error),
      });
      result.duration = Date.now() - startTime;

      await db
        .update(externalSyncLogs)
        .set({
          status: "failed",
          completedAt: new Date().toISOString(),
          duration: result.duration,
          errors: result.errors,
        })
        .where(eq(externalSyncLogs.id, syncLog.id));

      await db
        .update(externalSystemsConfig)
        .set({
          lastSyncAt: new Date().toISOString(),
          lastSyncStatus: "failed",
        })
        .where(eq(externalSystemsConfig.system, this.systemName));

      return result;
    }
  }
}
