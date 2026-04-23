import { and, asc, eq, getTableColumns, isNotNull } from "drizzle-orm";

import { DB } from "@/db";
import { developmentPlanRoutines, disciplines } from "@/db/schema";

export async function getRoutinesForPlayer(
  db: DB,
  input: { playerId: string }
) {
  const routineColumns = getTableColumns(developmentPlanRoutines);

  return db
    .select({
      ...routineColumns,
      disciplineKey: disciplines.key,
      disciplineLabel: disciplines.label,
    })
    .from(developmentPlanRoutines)
    .innerJoin(disciplines, eq(developmentPlanRoutines.disciplineId, disciplines.id))
    .where(
      and(
        eq(developmentPlanRoutines.playerId, input.playerId),
        isNotNull(developmentPlanRoutines.disciplineId)
      )
    )
    .orderBy(
      asc(disciplines.label),
      asc(developmentPlanRoutines.sortOrder),
      asc(developmentPlanRoutines.createdOn)
    );
}
