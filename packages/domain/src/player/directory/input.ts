export interface PlayerDirectoryBaseInput {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sport: "baseball" | "softball";
  throws: string;
  hits: string;
  prospect: boolean;
  primaryCoachId: string | null;
  createdAt: string;
  legacyPosition: string | null;
}

export interface PlayerDirectoryPositionInput {
  playerId: string;
  positionId: string;
  code: string;
  name: string;
  isPrimary: boolean;
}

export interface PlayerDirectoryInjurySummaryInput {
  playerId: string;
  hasLimited: boolean;
  hasActive: boolean;
  activeCount: number;
}

export interface PlayerDirectoryQueryInput {
  baseRows: PlayerDirectoryBaseInput[];
  positionRows: PlayerDirectoryPositionInput[];
  injurySummaryRows: PlayerDirectoryInjurySummaryInput[];
}
