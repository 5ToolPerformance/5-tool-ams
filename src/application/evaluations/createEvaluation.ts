import { eq } from "drizzle-orm";

import { DB } from "@/db";
import { evaluations } from "@/db/schema";
import type { EvaluationEvidenceWriteInput } from "@/domain/evaluations/evidence";
import { validateEvaluationDocument } from "@/domain/evaluations/validateEvaluationDocument";
import { getEvaluationById } from "@/db/queries/evaluations/getEvaluationById";

import {
  mergeDocumentDataWithEvidence,
  replaceEvaluationEvidence,
} from "./evidencePersistence";

export type CreateEvaluationInput = {
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

export async function createEvaluation(db: DB, input: CreateEvaluationInput) {
  validateEvaluationDocument(input);

  const evaluation = await db.transaction(async (tx) => {
    const [created] = await tx
      .insert(evaluations)
      .values({
        playerId: input.playerId,
        disciplineId: input.disciplineId,
        createdBy: input.createdBy,
        evaluationDate: input.evaluationDate,
        evaluationType: input.evaluationType,
        phase: input.phase,
        injuryConsiderations: input.injuryConsiderations ?? null,
        snapshotSummary: input.snapshotSummary,
        strengthProfileSummary: input.strengthProfileSummary,
        keyConstraintsSummary: input.keyConstraintsSummary,
        documentData: input.documentData ?? null,
      })
      .returning();

    const evidenceSummary = await replaceEvaluationEvidence({
      tx,
      playerId: input.playerId,
      disciplineId: input.disciplineId,
      evaluationId: created.id,
      evidenceForms: input.evidenceForms ?? [],
    });

    await tx
      .update(evaluations)
      .set({
        documentData: mergeDocumentDataWithEvidence(
          input.documentData,
          evidenceSummary
        ),
      })
      .where(eq(evaluations.id, created.id));

    return created;
  });

  return getEvaluationById(db, evaluation.id);
}
