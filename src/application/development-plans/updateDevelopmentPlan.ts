import { DB } from "@/db";
import {
  type UpdateDevelopmentPlanRowInput,
  updateDevelopmentPlan as updateDevelopmentPlanQuery,
} from "@/db/queries/development-plans/updateDevelopmentPlan";

export async function updateDevelopmentPlan(
  db: DB,
  developmentPlanId: string,
  input: UpdateDevelopmentPlanRowInput
) {
  return updateDevelopmentPlanQuery(db, developmentPlanId, input);
}
