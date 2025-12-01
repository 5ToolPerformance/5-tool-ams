export interface SyncResult {
  success: boolean;
  recordsCreated: number;
  recordsUpdated: number;
  recordsSkipped: number;
  recordsFailed: number;
  playersMatched: number;
  playersUnmatched: number;
  newMatchSuggestions: number;
  errors: Array<{ message: string; details?: string }>;
  duration: number;
}

export interface PlayerMatchResults {
  playerId: string | null;
  confidence: number;
  method: "email_match" | "external_id" | "name_match" | "manual";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

export abstract class BaseExternalService {
  protected abstract systemName: "armcare" | "hawkins";

  abstract authenticate(): Promise<string>;
  abstract refreshToken(): Promise<string>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract fetchData(token: string): Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract transformData(rawData: any): any[];
}
