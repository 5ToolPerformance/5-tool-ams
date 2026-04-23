import { DB } from "@/db";
import { universalRoutines } from "@/db/schema";

export type CreateUniversalRoutineRowInput = {
  facilityId: string;
  createdBy: string;
  title: string;
  description?: string | null;
  routineType: "partial_lesson" | "full_lesson" | "progression";
  disciplineId: string;
  sortOrder?: number;
  isActive?: boolean;
  documentData?: Record<string, unknown> | null;
};

export async function createUniversalRoutine(
  db: DB,
  input: CreateUniversalRoutineRowInput
) {
  const [row] = await db
    .insert(universalRoutines)
    .values({
      facilityId: input.facilityId,
      createdBy: input.createdBy,
      title: input.title,
      description: input.description ?? null,
      routineType: input.routineType,
      disciplineId: input.disciplineId,
      sortOrder: input.sortOrder ?? 0,
      isActive: input.isActive ?? true,
      documentData: input.documentData ?? null,
    })
    .returning();

  return row;
}
