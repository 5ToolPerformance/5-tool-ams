import { eq } from "drizzle-orm";

import { DB } from "@/db";
import { disciplines, universalRoutines, users } from "@/db/schema";
import { NotFoundError } from "@ams/domain/errors";

export async function getUniversalRoutineById(db: DB, routineId: string) {
  const [row] = await db
    .select({
      id: universalRoutines.id,
      facilityId: universalRoutines.facilityId,
      createdBy: universalRoutines.createdBy,
      createdByName: users.name,
      title: universalRoutines.title,
      description: universalRoutines.description,
      routineType: universalRoutines.routineType,
      disciplineId: universalRoutines.disciplineId,
      disciplineKey: disciplines.key,
      disciplineLabel: disciplines.label,
      sortOrder: universalRoutines.sortOrder,
      isActive: universalRoutines.isActive,
      documentData: universalRoutines.documentData,
      createdOn: universalRoutines.createdOn,
      updatedOn: universalRoutines.updatedOn,
    })
    .from(universalRoutines)
    .innerJoin(users, eq(universalRoutines.createdBy, users.id))
    .innerJoin(disciplines, eq(universalRoutines.disciplineId, disciplines.id))
    .where(eq(universalRoutines.id, routineId))
    .limit(1);

  if (!row) {
    throw new NotFoundError("Universal routine not found.");
  }

  return row;
}
