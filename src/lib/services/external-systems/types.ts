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

export interface PlayerArmCareSummary {
  latestExam: {
    id: string;
    playerId: string;
    externalExamId: string;
    examDate: string;
    examTime: string | null;
    examType: string | null;
    armScore: string | null;
    totalStrength: string | null;
    shoulderBalance: string | null;
    velo: string | null;
    svr: string | null;
    totalStrengthPost: string | null;
    postStrengthLoss: string | null;
    totalPercentFresh: string | null;
    rawData: unknown;
    syncedAt: string;
    syncLogId: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  history: {
    armScore: Array<{
      date: string;
      value: number | null;
      examType: string | null;
      examId: string;
    }>;
    totalStrength: Array<{
      date: string;
      value: number | null;
      examType: string | null;
      examId: string;
    }>;
    shoulderBalance: Array<{
      date: string;
      value: number | null;
      examType: string | null;
      examId: string;
    }>;
    velo: Array<{
      date: string;
      value: number | null;
      examType: string | null;
      examId: string;
    }>;
    svr: Array<{
      date: string;
      value: number | null;
      examType: string | null;
      examId: string;
    }>;
    totalStrengthPost: Array<{
      date: string;
      value: number | null;
      examType: string | null;
      examId: string;
    }>;
    postStrengthLoss: Array<{
      date: string;
      value: number | null;
      examType: string | null;
      examId: string;
    }>;
    totalPercentFresh: Array<{
      date: string;
      value: number | null;
      examType: string | null;
      examId: string;
    }>;
  };
  stats: {
    totalExams: number;
    avgArmScore: number | null;
    avgTotalStrength: number | null;
    avgShoulderBalance: number | null;
    firstExamDate: string | null;
    lastExamDate: string | null;
  };
}
