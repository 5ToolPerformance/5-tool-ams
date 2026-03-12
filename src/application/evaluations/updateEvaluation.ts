import { DB } from "@/db";
import {
  type UpdateEvaluationRowInput,
  updateEvaluation as updateEvaluationQuery,
} from "@/db/queries/evaluations/updateEvaluation";
import { validateEvaluationDocument } from "@/domain/evaluations/validateEvaluationDocument";

export async function updateEvaluation(
  db: DB,
  evaluationId: string,
  input: UpdateEvaluationRowInput & {
    playerId: string;
    disciplineId: string;
    createdBy: string;
  }
) {
  validateEvaluationDocument({
    playerId: input.playerId,
    disciplineId: input.disciplineId,
    createdBy: input.createdBy,
    evaluationDate: input.evaluationDate,
    evaluationType: input.evaluationType,
    phase: input.phase,
    injuryConsiderations: input.injuryConsiderations,
    snapshotSummary: input.snapshotSummary,
    strengthProfileSummary: input.strengthProfileSummary,
    keyConstraintsSummary: input.keyConstraintsSummary,
    documentData: input.documentData,
  });

  return updateEvaluationQuery(db, evaluationId, input);
}
