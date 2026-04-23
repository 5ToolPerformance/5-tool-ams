export interface LogInjuryInput {
  playerId: string;

  bodyPartId: string;
  focusAreaId?: string;

  side: "left" | "right" | "bilateral" | "none";

  level: "soreness" | "injury" | "diagnosis";
  confidence: "self_reported" | "observed" | "assessed" | "diagnosed";

  startDate?: string; // defaulted if missing
  notes?: string;
}
