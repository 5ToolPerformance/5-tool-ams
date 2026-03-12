import { eq } from "drizzle-orm";

import { DB } from "@/db";
import { developmentPlanRoutines } from "@/db/schema";

import { getRoutineById } from "./getRoutineById";

export type UpdateRoutineRowInput = {
  title: string;
  description?: string | null;
  routineType: "partial_lesson" | "full_lesson" | "progression";
  sortOrder?: number;
  isActive?: boolean;
  documentData?: Record<string, unknown> | null;
};

export async function updateRoutine(
  db: DB,
  routineId: string,
  input: UpdateRoutineRowInput
) {
  await db
    .update(developmentPlanRoutines)
    .set({
      title: input.title,
      description: input.description ?? null,
      routineType: input.routineType,
      sortOrder: input.sortOrder ?? 0,
      isActive: input.isActive ?? true,
      documentData: input.documentData ?? null,
      updatedOn: new Date(),
    })
    .where(eq(developmentPlanRoutines.id, routineId));

  return getRoutineById(db, routineId);
}
