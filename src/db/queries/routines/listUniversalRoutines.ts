import { and, desc, eq, ilike, or } from "drizzle-orm";

import db, { DB } from "@/db";
import { disciplines, universalRoutines, users } from "@/db/schema";

export type ListUniversalRoutinesParams = {
  facilityId: string;
  disciplineId?: string;
  query?: string;
};

export async function listUniversalRoutines(
  params: ListUniversalRoutinesParams,
  conn: DB = db
) {
  const normalizedQuery = params.query?.trim();

  return conn
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
    .where(
      and(
        eq(universalRoutines.facilityId, params.facilityId),
        params.disciplineId
          ? eq(universalRoutines.disciplineId, params.disciplineId)
          : undefined,
        normalizedQuery
          ? or(
              ilike(universalRoutines.title, `%${normalizedQuery}%`),
              ilike(universalRoutines.description, `%${normalizedQuery}%`)
            )
          : undefined
      )
    )
    .orderBy(
      desc(universalRoutines.isActive),
      universalRoutines.sortOrder,
      desc(universalRoutines.updatedOn)
    );
}
