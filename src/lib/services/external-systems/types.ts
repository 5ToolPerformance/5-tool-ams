/**
 * Sync result metrics
 */
export interface SyncResult {
  success: boolean;
  recordsCreated: number;
  recordsUpdated: number;
  recordsSkipped: number;
  recordsFailed: number;
  playersMatched: number;
  playersUnmatched: number;
  newMatchSuggestions: number;
  errors: Array<{ message: string; details?: unknown }>;
  duration: number;
}

/**
 * Player matching result with confidence score
 */
export interface PlayerMatchResult {
  playerId: string | null;
  confidence: number;
  method: "email_match" | "external_id" | "name_match" | "manual";
  metadata?: Record<string, unknown>;
}

/**
 * External player identification data
 */
export interface ExternalPlayerData {
  externalId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Base interface for external data records
 */
export interface BaseExternalRecord {
  externalId: string;
  date: string;
  rawData: unknown; // Truly arbitrary JSON from external API
}
