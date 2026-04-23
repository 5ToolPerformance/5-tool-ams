export type InjuryStatus = "active" | "limited" | "resolved";
export type InjuryLevel = "soreness" | "injury" | "diagnosis";
export type InjurySide = "left" | "right" | "bilateral" | "none";
export type InjuryReportedByRole = "coach" | "trainer" | "medical" | "athlete";
export type InjuryConfidence =
  | "self_reported"
  | "observed"
  | "assessed"
  | "diagnosed";

export interface Injury {
  id: string;
  playerId: string;
  bodyPart: string;
  focusArea?: string;
  side: InjurySide;
  status: InjuryStatus;
  level: InjuryLevel;
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface InjuryInsert {
  playerId: string;
  reportedByUserId?: string;
  reportedByRole: InjuryReportedByRole;
  bodyPartId: string;
  focusAreaId?: string | null;
  side: InjurySide;
  status: InjuryStatus;
  level: InjuryLevel;
  confidence: InjuryConfidence;
  startDate: string;
  notes?: string | null;
  endDate?: string | null;
}
