import { injury } from "@/db/schema";

export type InjuryInsert = typeof injury.$inferInsert;
export type InjurySelect = typeof injury.$inferSelect;

export type InjuryStatus = "active" | "limited" | "resolved";
export type InjuryLevel = "soreness" | "injury" | "diagnosis";

export interface Injury {
  id: string;
  playerId: string;
  bodyPart: string;
  focusArea?: string;
  side: "left" | "right" | "bilateral" | "none";
  status: InjuryStatus;
  level: InjuryLevel;
  startDate: string;
  endDate?: string;
}
