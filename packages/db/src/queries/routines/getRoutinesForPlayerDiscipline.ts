import { and, asc, eq, getTableColumns, isNotNull } from "drizzle-orm";

import { DB } from "@/db";
import { developmentPlanRoutines, disciplines } from "@/db/schema";

export async function getRoutinesForPlayerDiscipline(
  db: DB,
  input: { playerId: string; disciplineId: string }
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
        isNotNull(developmentPlanRoutines.disciplineId),
        eq(developmentPlanRoutines.disciplineId, input.disciplineId)
      )
    )
    .orderBy(
      asc(developmentPlanRoutines.sortOrder),
      asc(developmentPlanRoutines.createdOn)
    );
}
