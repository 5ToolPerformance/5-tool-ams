import { eq } from "drizzle-orm";

import { DB } from "@/db";
import { evaluations } from "@/db/schema";
import { NotFoundError } from "@ams/domain/errors";

import { getEvaluationAttachmentsByEvaluationId } from "./getEvaluationAttachmentsByEvaluationId";
import { getEvaluationEvidenceByEvaluationId } from "./getEvaluationEvidenceByEvaluationId";

export async function getEvaluationById(db: DB, evaluationId: string) {
  const [row] = await db
    .select()
    .from(evaluations)
    .where(eq(evaluations.id, evaluationId))
    .limit(1);

  if (!row) {
    throw new NotFoundError("Evaluation not found.");
  }

  const [evidenceForms, mediaAttachments] = await Promise.all([
    getEvaluationEvidenceByEvaluationId(db, row.id),
    getEvaluationAttachmentsByEvaluationId(db, row.id),
  ]);

  return {
    ...row,
    evidenceForms,
    mediaAttachments,
  };
}
