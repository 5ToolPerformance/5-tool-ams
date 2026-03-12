import { eq } from "drizzle-orm";

import { DB } from "@/db";
import { developmentPlans } from "@/db/schema";

import { getDevelopmentPlanById } from "./getDevelopmentPlanById";

export type UpdateDevelopmentPlanRowInput = {
  status?: "draft" | "active" | "completed" | "archived";
  startDate?: Date | null;
  targetEndDate?: Date | null;
  documentData?: Record<string, unknown> | null;
};

export async function updateDevelopmentPlan(
  db: DB,
  developmentPlanId: string,
  input: UpdateDevelopmentPlanRowInput
) {
  await db
    .update(developmentPlans)
    .set({
      status: input.status ?? "draft",
      startDate: input.startDate ?? null,
      targetEndDate: input.targetEndDate ?? null,
      documentData: input.documentData ?? null,
      updatedOn: new Date(),
    })
    .where(eq(developmentPlans.id, developmentPlanId));

  return getDevelopmentPlanById(db, developmentPlanId);
}
