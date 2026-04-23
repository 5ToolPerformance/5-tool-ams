import { DB } from "@/db";
import { developmentPlanRoutines } from "@/db/schema";

export type CreateRoutineRowInput = {
  playerId: string;
  disciplineId: string;
  developmentPlanId?: string;
  createdBy: string;
  title: string;
  description?: string | null;
  routineType: "partial_lesson" | "full_lesson" | "progression";
  sortOrder?: number;
  isActive?: boolean;
  documentData?: Record<string, unknown> | null;
};

export async function createRoutine(db: DB, input: CreateRoutineRowInput) {
  const [row] = await db
    .insert(developmentPlanRoutines)
    .values({
      playerId: input.playerId,
      disciplineId: input.disciplineId,
      developmentPlanId: input.developmentPlanId,
      createdBy: input.createdBy,
      title: input.title,
      description: input.description ?? null,
      routineType: input.routineType,
      sortOrder: input.sortOrder ?? 0,
      isActive: input.isActive ?? true,
      documentData: input.documentData ?? null,
    })
    .returning();

  return row;
}
