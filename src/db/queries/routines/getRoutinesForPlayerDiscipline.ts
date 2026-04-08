import { and, asc, eq } from "drizzle-orm";

import { DB } from "@/db";
import { developmentPlanRoutines } from "@/db/schema";

export async function getRoutinesForPlayerDiscipline(
  db: DB,
  input: { playerId: string; disciplineId: string }
) {
  return db
    .select()
    .from(developmentPlanRoutines)
    .where(
      and(
        eq(developmentPlanRoutines.playerId, input.playerId),
        eq(developmentPlanRoutines.disciplineId, input.disciplineId)
      )
    )
    .orderBy(
      asc(developmentPlanRoutines.sortOrder),
      asc(developmentPlanRoutines.createdOn)
    );
}
