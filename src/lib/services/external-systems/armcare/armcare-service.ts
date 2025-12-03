// lib/services/external/armcare/armcare-service.ts
import { and, eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";

import db from "@/db";
import {
  armcareExams,
  armcareExamsUnmatched,
  externalAthleteIds,
  externalSystemsTokens,
} from "@/db/schema";

import { BaseExternalService } from "../base-external-service";
import { ExternalConfig } from "../config";
import { ExternalPlayerData, PlayerMatchResult, SyncResult } from "../types";
import {
  ArmCareAPIResponse,
  ArmCareAPIResponseSchema,
  ArmCareAuthResponse,
  ArmCareConfig,
  ArmCareExamRecord,
  ArmCareExamRow,
} from "./types";

export class ArmCareService extends BaseExternalService<
  ArmCareAPIResponse,
  ArmCareExamRecord,
  ArmCareConfig
> {
  protected systemName = "armcare" as const;

  protected getConfig(): ArmCareConfig {
    return ExternalConfig.getArmCareConfig();
  }

  private toNumericString(value: number | null): string | null {
    return value !== null ? value.toString() : null;
  }

  async authenticate(): Promise<string> {
    try {
      // Check for existing valid token
      const existingToken = await db.query.externalSystemsTokens.findFirst({
        where: eq(externalSystemsTokens.system, "armcare"),
      });

      if (existingToken && new Date(existingToken.expiresAt) > new Date()) {
        console.log("✓ Using existing token");
        return existingToken.accessToken;
      }

      // Get credentials
      console.log("→ Requesting new token...");
      const config = this.getConfig();

      // Request new token
      const response = await fetch(`${config.authUrl}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "password",
          username: config.username,
          password: config.password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ArmCare authentication failed: ${errorText}`);
      }

      const data = (await response.json()) as ArmCareAuthResponse;
      console.log("✓ Token received, expires_in:", data.expires_in);

      const expiresIn = data.expires_in || 21600; // Default 6 hours if not provided
      const expiresAt = new Date(Date.now() + expiresIn * 1000);

      console.log("→ Token expires at:", expiresAt.toISOString());
      // Store token
      await db
        .insert(externalSystemsTokens)
        .values({
          system: "armcare",
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt: new Date(
            Date.now() + data.expires_in * 1000
          ).toISOString(),
        })
        .onConflictDoUpdate({
          target: externalSystemsTokens.system,
          set: {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresAt: new Date(
              Date.now() + data.expires_in * 1000
            ).toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });

      console.log("✓ Token saved to database");
      return data.access_token;
    } catch (error) {
      console.error("❌ Authentication error:", error);
      throw error;
    }
  }

  async refreshToken(): Promise<string> {
    return this.authenticate();
  }

  protected async fetchData(token: string): Promise<ArmCareAPIResponse> {
    try {
      console.log("→ Fetching data from ArmCare API...");
      const config = this.getConfig();

      const response = await fetch(
        `${config.apiUrl}/v1/third-party/exams-info`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch ArmCare data: ${errorText}`);
      }

      const rawData: unknown = await response.json();
      console.log("✓ Data fetched successfully");

      // BACKUP: Save raw response immediately
      await this.saveBackup(rawData);

      // Validate with Zod
      console.log("→ Validating data structure...");
      const validatedData = ArmCareAPIResponseSchema.parse(rawData);
      console.log(
        "✓ Data validated, exam count:",
        validatedData.playerExamsInfo.length
      );

      return validatedData;
    } catch (error) {
      console.error("❌ Fetch data error:", error);
      throw error;
    }
  }

  /**
   * Save raw API response to backup file
   */
  private async saveBackup(data: unknown): Promise<void> {
    try {
      const backupDir = path.join(process.cwd(), "data", "armcare-backups");
      await fs.mkdir(backupDir, { recursive: true });

      const timestamp = new Date()
        .toISOString()
        .replace(/:/g, "-")
        .split(".")[0];
      const filename = `armcare_${timestamp}.json`;
      const filepath = path.join(backupDir, filename);

      await fs.writeFile(filepath, JSON.stringify(data, null, 2), "utf-8");

      console.log(`✓ Saved backup to: ${filepath}`);
    } catch (error) {
      console.error("⚠️ Failed to save backup:", error);
      // Don't throw - continue with sync even if backup fails
    }
  }

  protected transformData(rawData: ArmCareAPIResponse): ArmCareExamRecord[] {
    console.log("→ Transforming data...");
    const records = rawData.playerExamsInfo.map((exam, index) => {
      try {
        return this.transformExam(exam);
      } catch (error) {
        console.error(`❌ Failed to transform exam ${index}:`, error);
        console.error("Exam data:", JSON.stringify(exam, null, 2));
        throw error;
      }
    });
    console.log("✓ Data transformed successfully");
    return records;
  }

  private transformExam(exam: ArmCareExamRow): ArmCareExamRecord {
    // Log the exam date to debug
    console.log("→ Parsing exam date:", exam["Exam Date"]);

    try {
      const parsedDate = this.parseDate(exam["Exam Date"]);
      console.log("  ✓ Parsed date:", parsedDate);

      return {
        externalId: exam["Exam ID"],
        date: parsedDate,

        playerId: null,
        externalPlayerId: exam["ArmCare ID"],
        externalEmail: exam.Email || "",
        externalFirstName: exam["First Name"],
        externalLastName: exam["Last Name"],

        examTime: exam.Time && exam.Time !== " " ? exam.Time : null,
        examType: exam["Exam Type"],
        timezone: exam.Timezone,

        armScore: this.parseNumeric(exam["Arm Score"]),
        totalStrength: this.parseNumeric(exam["Total Strength"]),
        shoulderBalance: this.parseNumeric(exam["Shoulder Balance"]),
        velo: this.parseNumeric(exam.Velo),
        svr: this.parseNumeric(exam.SVR),
        totalStrengthPost: this.parseNumeric(exam["Total Strength Post"]),
        postStrengthLoss: this.parseNumeric(exam["Post Strength Loss"]),
        totalPercentFresh: this.parseNumeric(exam["Total %Fresh"]),

        rawData: exam,
      };
    } catch (error) {
      console.error("❌ Transform exam failed:", error);
      console.error("Exam data:", JSON.stringify(exam, null, 2));
      throw error;
    }
  }

  protected extractPlayerData(record: ArmCareExamRecord): ExternalPlayerData {
    return {
      externalId: record.externalPlayerId,
      email: record.externalEmail,
      firstName: record.externalFirstName,
      lastName: record.externalLastName,
    };
  }

  protected async processRecord(
    record: ArmCareExamRecord,
    syncLogId: string,
    result: SyncResult
  ): Promise<void> {
    // Match player
    const playerData = this.extractPlayerData(record);
    const match = await this.matchPlayer(playerData);

    if (!match.playerId) {
      // Store in unmatched staging table
      await this.storeUnmatchedExam(record, syncLogId, match);
      result.playersUnmatched++;
      result.recordsCreated++;
      return;
    }

    result.playersMatched++;

    // Ensure mapping exists
    await this.ensurePlayerMapping(
      match.playerId,
      record.externalPlayerId,
      record.externalEmail,
      match.method,
      match.confidence
    );

    // Check if exam already exists
    const existing = await db.query.armcareExams.findFirst({
      where: eq(armcareExams.externalExamId, record.externalId),
    });

    const examData = {
      playerId: match.playerId,
      externalExamId: record.externalId,
      examDate: record.date,
      examTime: record.examTime,
      examType: record.examType,
      timezone: record.timezone,
      armScore: this.toNumericString(record.armScore),
      totalStrength: this.toNumericString(record.totalStrength),
      shoulderBalance: this.toNumericString(record.shoulderBalance),
      velo: this.toNumericString(record.velo),
      svr: this.toNumericString(record.svr),
      totalStrengthPost: this.toNumericString(record.totalStrengthPost),
      postStrengthLoss: this.toNumericString(record.postStrengthLoss),
      totalPercentFresh: this.toNumericString(record.totalPercentFresh),

      rawData: record.rawData,
      syncLogId,
      syncedAt: new Date().toISOString(),
    };

    if (existing) {
      const hasChanges =
        JSON.stringify(existing.rawData) !== JSON.stringify(record.rawData);

      if (hasChanges) {
        await db
          .update(armcareExams)
          .set({ ...examData, updatedAt: new Date().toISOString() })
          .where(eq(armcareExams.id, existing.id));
        result.recordsUpdated++;
      } else {
        result.recordsSkipped++;
      }
    } else {
      await db.insert(armcareExams).values(examData);
      result.recordsCreated++;
    }
  }

  private async storeUnmatchedExam(
    record: ArmCareExamRecord,
    syncLogId: string,
    match: PlayerMatchResult
  ): Promise<void> {
    const existing = await db.query.armcareExamsUnmatched.findFirst({
      where: eq(armcareExamsUnmatched.externalExamId, record.externalId),
    });

    const unmatchedData = {
      externalExamId: record.externalId,
      externalPlayerId: record.externalPlayerId,
      externalEmail: record.externalEmail,
      externalFirstName: record.externalFirstName,
      externalLastName: record.externalLastName,

      examDate: record.date,
      examTime: record.examTime,
      examType: record.examType,
      timezone: record.timezone,

      armScore: this.toNumericString(record.armScore),
      totalStrength: this.toNumericString(record.totalStrength),
      shoulderBalance: this.toNumericString(record.shoulderBalance),
      velo: this.toNumericString(record.velo),
      svr: this.toNumericString(record.svr),
      totalStrengthPost: this.toNumericString(record.totalStrengthPost),
      postStrengthLoss: this.toNumericString(record.postStrengthLoss),
      totalPercentFresh: this.toNumericString(record.totalPercentFresh),

      rawData: record.rawData,

      matchAttempts: existing ? (existing.matchAttempts ?? 0) + 1 : 1,
      lastMatchAttempt: new Date().toISOString(),
      matchErrors: {
        confidence: match.confidence,
        method: match.method,
        timestamp: new Date().toISOString(),
      },

      syncLogId,
      syncedAt: new Date().toISOString(),
      status: "pending" as const,
    };

    if (existing) {
      await db
        .update(armcareExamsUnmatched)
        .set({ ...unmatchedData, updatedAt: new Date().toISOString() })
        .where(eq(armcareExamsUnmatched.id, existing.id));
    } else {
      await db.insert(armcareExamsUnmatched).values(unmatchedData);
    }
  }

  private async ensurePlayerMapping(
    playerId: string,
    externalId: string,
    externalEmail: string,
    method: "email_match" | "external_id" | "name_match" | "manual",
    confidence: number
  ): Promise<void> {
    const existing = await db.query.externalAthleteIds.findFirst({
      where: and(
        eq(externalAthleteIds.playerId, playerId),
        eq(externalAthleteIds.externalSystem, "armcare")
      ),
    });

    if (!existing) {
      await db.insert(externalAthleteIds).values({
        playerId,
        externalSystem: "armcare",
        externalId,
        externalEmail,
        linkingMethod: method,
        linkingStatus: "active",
        confidence: confidence.toString(),
      });
    }
  }

  private parseDate(dateStr: string): string {
    try {
      console.log("  → Input date string:", dateStr);

      // Handle various date formats
      if (!dateStr || dateStr.trim() === "") {
        throw new Error("Empty date string");
      }

      // Expected format: "08/22/2024" or "8/22/2024"
      const parts = dateStr.split("/");

      if (parts.length !== 3) {
        throw new Error(
          `Invalid date format, expected MM/DD/YYYY, got: ${dateStr}`
        );
      }

      const [month, day, year] = parts;

      // Validate parts
      const monthNum = parseInt(month, 10);
      const dayNum = parseInt(day, 10);
      const yearNum = parseInt(year, 10);

      if (isNaN(monthNum) || isNaN(dayNum) || isNaN(yearNum)) {
        throw new Error(`Non-numeric date parts: ${dateStr}`);
      }

      if (monthNum < 1 || monthNum > 12) {
        throw new Error(`Invalid month: ${monthNum}`);
      }

      if (dayNum < 1 || dayNum > 31) {
        throw new Error(`Invalid day: ${dayNum}`);
      }

      // Create ISO date string
      const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

      // Validate it's a real date
      const testDate = new Date(isoDate);
      if (isNaN(testDate.getTime())) {
        throw new Error(`Invalid date: ${isoDate}`);
      }

      console.log("  ✓ Output ISO date:", isoDate);
      return isoDate;
    } catch (error) {
      console.error("❌ Date parsing failed:", error);
      throw new Error(`Failed to parse date "${dateStr}": ${error}`);
    }
  }

  private parseNumeric(value: string | number): number | null {
    if (
      value === " " ||
      value === "" ||
      value === null ||
      value === undefined
    ) {
      return null;
    }
    const num = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(num) ? null : num;
  }
}
