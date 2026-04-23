export type PlayerDirectoryInjuryStatus = "none" | "injured" | "limited";
export type PlayerDirectorySortKey = "firstName" | "lastName" | "age";
export type PlayerDirectorySortOrder = "asc" | "desc";

export interface PlayerDirectoryPosition {
  id: string | null;
  code: string;
  name: string;
}

export interface PlayerDirectoryItem {
  id: string;
  firstName: string;
  lastName: string;
  age: number | null;
  dateOfBirth: string;
  sport: "baseball" | "softball";
  throws: string;
  hits: string;
  prospect: boolean;
  primaryCoachId: string | null;
  createdAt: string;
  primaryPosition: PlayerDirectoryPosition | null;
  secondaryPositions: PlayerDirectoryPosition[];
  injuryStatus: PlayerDirectoryInjuryStatus;
  injuryActiveCount: number;
}

export interface PlayerDirectoryFiltersState {
  searchTerm: string;
  ageFilter: string;
  positionFilter: string;
  injuryStatusFilter: "" | PlayerDirectoryInjuryStatus;
  prospectFilter: "" | "prospect" | "nonProspect";
  sortBy: PlayerDirectorySortKey;
  sortOrder: PlayerDirectorySortOrder;
}
