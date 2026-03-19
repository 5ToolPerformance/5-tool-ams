import { DB } from "@/db";
import { evaluations } from "@/db/schema";

export type CreateEvaluationRowInput = {
  playerId: string;
  disciplineId: string;
  createdBy: string;
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

export async function createEvaluation(
  db: DB,
  input: CreateEvaluationRowInput
) {
  const [row] = await db
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

  return row;
}
