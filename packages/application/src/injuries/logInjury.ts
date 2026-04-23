import { LogInjuryInput } from "@/application/injuries/logInjury.types";
import { DB } from "@ams/db";
import { createInjury } from "@ams/db/queries/injuries/createInjury";

export async function logInjury(
  db: DB,
  input: LogInjuryInput,
  context: {
    reportedByUserId?: string;
    reportedByRole: "coach" | "trainer" | "medical";
  }
) {
  const startDate = input.startDate ?? new Date().toISOString();

  return createInjury(db, {
    playerId: input.playerId,
    bodyPartId: input.bodyPartId,
    focusAreaId: input.focusAreaId,
    side: input.side,
    level: input.level,
    confidence: "observed",

    status: "active",
    startDate,

    notes: input.notes,

    reportedByUserId: context.reportedByUserId,
    reportedByRole: context.reportedByRole,
  });
}
