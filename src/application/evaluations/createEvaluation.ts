import { DB } from "@/db";
import {
  type CreateEvaluationRowInput,
  createEvaluation as createEvaluationQuery,
} from "@/db/queries/evaluations/createEvaluation";
import { validateEvaluationDocument } from "@/domain/evaluations/validateEvaluationDocument";

export async function createEvaluation(
  db: DB,
  input: CreateEvaluationRowInput
) {
  validateEvaluationDocument(input);
  return createEvaluationQuery(db, input);
}
