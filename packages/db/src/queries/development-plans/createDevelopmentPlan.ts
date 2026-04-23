import { DB } from "@/db";
import { developmentPlans } from "@/db/schema";

export type CreateDevelopmentPlanRowInput = {
  playerId: string;
  disciplineId: string;
  evaluationId: string;
  createdBy: string;
  status?: "draft" | "active" | "completed" | "archived";
  startDate?: Date | null;
  targetEndDate?: Date | null;
  documentData?: Record<string, unknown> | null;
};

export async function createDevelopmentPlan(
  db: DB,
  input: CreateDevelopmentPlanRowInput
) {
  const [row] = await db
    .insert(developmentPlans)
    .values({
      playerId: input.playerId,
      disciplineId: input.disciplineId,
      evaluationId: input.evaluationId,
      createdBy: input.createdBy,
      status: input.status ?? "draft",
      startDate: input.startDate ?? null,
      targetEndDate: input.targetEndDate ?? null,
      documentData: input.documentData ?? null,
    })
    .returning();

  return row;
}
