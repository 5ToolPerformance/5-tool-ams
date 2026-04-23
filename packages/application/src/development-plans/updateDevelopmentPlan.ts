import { DB } from "@ams/db";
import {
  type UpdateDevelopmentPlanRowInput,
  updateDevelopmentPlan as updateDevelopmentPlanQuery,
} from "@ams/db/queries/development-plans/updateDevelopmentPlan";

export async function updateDevelopmentPlan(
  db: DB,
  developmentPlanId: string,
  input: UpdateDevelopmentPlanRowInput
) {
  return updateDevelopmentPlanQuery(db, developmentPlanId, input);
}
