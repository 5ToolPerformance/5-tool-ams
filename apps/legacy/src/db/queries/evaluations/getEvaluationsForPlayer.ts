import { and, desc, eq } from "drizzle-orm";

import { DB } from "@/db";
import { evaluations } from "@/db/schema";

export async function getEvaluationsForPlayer(
  db: DB,
  input: {
    playerId: string;
    disciplineId?: string;
    limit?: number;
  }
) {
  const filters = [eq(evaluations.playerId, input.playerId)];

  if (input.disciplineId) {
    filters.push(eq(evaluations.disciplineId, input.disciplineId));
  }

  return db
    .select()
    .from(evaluations)
    .where(and(...filters))
    .orderBy(desc(evaluations.evaluationDate), desc(evaluations.createdOn))
    .limit(input.limit ?? 25);
}
