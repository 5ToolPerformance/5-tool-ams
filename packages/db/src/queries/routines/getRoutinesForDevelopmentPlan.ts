import { asc, eq } from "drizzle-orm";

import { DB } from "@/db";
import { developmentPlanRoutines } from "@/db/schema";

export async function getRoutinesForDevelopmentPlan(
  db: DB,
  developmentPlanId: string
) {
  return db
    .select()
    .from(developmentPlanRoutines)
    .where(eq(developmentPlanRoutines.developmentPlanId, developmentPlanId))
    .orderBy(
      asc(developmentPlanRoutines.sortOrder),
      asc(developmentPlanRoutines.createdOn)
    );
}
