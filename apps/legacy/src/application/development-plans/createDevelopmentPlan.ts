import { DB } from "@/db";
import {
  type CreateDevelopmentPlanRowInput,
  createDevelopmentPlan as createDevelopmentPlanQuery,
} from "@/db/queries/development-plans/createDevelopmentPlan";
import { getEvaluationById } from "@/db/queries/evaluations/getEvaluationById";
import { assertPlanMatchesEvaluation } from "@/domain/development-plans/assertPlanMatchesEvaluation";
import { validateDevelopmentPlanDocument } from "@/domain/development-plans/validateDevelopmentPlanDocument";

export async function createDevelopmentPlan(
  db: DB,
  input: CreateDevelopmentPlanRowInput
) {
  validateDevelopmentPlanDocument(input);

  const evaluation = await getEvaluationById(db, input.evaluationId);

  assertPlanMatchesEvaluation({
    evaluation,
    input: {
      playerId: input.playerId,
      disciplineId: input.disciplineId,
      evaluationId: input.evaluationId,
    },
  });

  return createDevelopmentPlanQuery(db, input);
}
