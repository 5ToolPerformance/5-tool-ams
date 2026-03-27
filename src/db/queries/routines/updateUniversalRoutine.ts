import { eq } from "drizzle-orm";

import { DB } from "@/db";
import { universalRoutines } from "@/db/schema";

import { getUniversalRoutineById } from "./getUniversalRoutineById";

export type UpdateUniversalRoutineRowInput = {
  title: string;
  description?: string | null;
  routineType: "partial_lesson" | "full_lesson" | "progression";
  disciplineId: string;
  sortOrder?: number;
  isActive?: boolean;
  documentData?: Record<string, unknown> | null;
};

export async function updateUniversalRoutine(
  db: DB,
  routineId: string,
  input: UpdateUniversalRoutineRowInput
) {
  await db
    .update(universalRoutines)
    .set({
      title: input.title,
      description: input.description ?? null,
      routineType: input.routineType,
      disciplineId: input.disciplineId,
      sortOrder: input.sortOrder ?? 0,
      isActive: input.isActive ?? true,
      documentData: input.documentData ?? null,
      updatedOn: new Date(),
    })
    .where(eq(universalRoutines.id, routineId));

  return getUniversalRoutineById(db, routineId);
}
