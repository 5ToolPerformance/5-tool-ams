import { eq } from "drizzle-orm";

import { DB } from "@/db";
import { evaluations } from "@/db/schema";

import { getEvaluationById } from "./getEvaluationById";

export type UpdateEvaluationRowInput = {
  evaluationDate: Date;
  evaluationType:
    | "baseline"
    | "monthly"
    | "season_review"
    | "injury_return"
    | "general";
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
};

export async function updateEvaluation(
  db: DB,
  evaluationId: string,
  input: UpdateEvaluationRowInput
) {
  await db
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

  return getEvaluationById(db, evaluationId);
}
