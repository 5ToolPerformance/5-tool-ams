import { eq } from "drizzle-orm";

import { DB } from "@/db";
import { evaluations } from "@/db/schema";
import { NotFoundError } from "@/lib/errors";

export async function getEvaluationById(db: DB, evaluationId: string) {
  const [row] = await db
    .select()
    .from(evaluations)
    .where(eq(evaluations.id, evaluationId))
    .limit(1);

  if (!row) {
    throw new NotFoundError("Evaluation not found.");
  }

  return row;
}
