import { eq } from "drizzle-orm";

import { DB } from "@ams/db";
import { getEvaluationById } from "@ams/db/queries/evaluations/getEvaluationById";
import { evaluations } from "@ams/db/schema";
import type { EvaluationEvidenceWriteInput } from "@ams/domain/evaluations/evidence";
import { validateEvaluationDocument } from "@ams/domain/evaluations/validateEvaluationDocument";

import {
  mergeDocumentDataWithEvidence,
  replaceEvaluationEvidence,
} from "./evidencePersistence";

export type UpdateEvaluationInput = {
  playerId: string;
  disciplineId: string;
  createdBy: string;
  evaluationDate: Date;
  evaluationType:
    | "baseline"
    | "monthly"
    | "season_review"
    | "injury_return"
    | "general"
    | "tests_only";
  phase:
    | "offseason"
    | "preseason"
    | "inseason"
    | "postseason"
    | "rehab"
    | "return_to_play"
    | "general";
  injuryConsiderations?: string | null;
  snapshotSummary: string;
  strengthProfileSummary: string;
  keyConstraintsSummary: string;
  documentData?: Record<string, unknown> | null;
  evidenceForms?: EvaluationEvidenceWriteInput[];
};

export async function updateEvaluation(
  db: DB,
  evaluationId: string,
  input: UpdateEvaluationInput
) {
  validateEvaluationDocument(input);

  await db.transaction(async (tx) => {
    await tx
      .update(evaluations)
      .set({
        evaluationDate: input.evaluationDate,
        evaluationType: input.evaluationType,
        phase: input.phase,
        injuryConsiderations: input.injuryConsiderations ?? null,
        snapshotSummary: input.snapshotSummary,
        strengthProfileSummary: input.strengthProfileSummary,
        keyConstraintsSummary: input.keyConstraintsSummary,
        documentData: input.documentData ?? null,
        updatedOn: new Date(),
      })
      .where(eq(evaluations.id, evaluationId));

    const evidenceSummary = await replaceEvaluationEvidence({
      tx,
      playerId: input.playerId,
      disciplineId: input.disciplineId,
      evaluationId,
      evidenceForms: input.evidenceForms ?? [],
    });

    await tx
      .update(evaluations)
      .set({
        documentData: mergeDocumentDataWithEvidence(
          input.documentData,
          evidenceSummary
        ),
        updatedOn: new Date(),
      })
      .where(eq(evaluations.id, evaluationId));
  });

  return getEvaluationById(db, evaluationId);
}
