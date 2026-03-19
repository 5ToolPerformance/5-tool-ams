import { and, desc, eq } from "drizzle-orm";

import { DB } from "@/db";
import { developmentPlans } from "@/db/schema";

export async function getDevelopmentPlansForPlayer(
  db: DB,
  input: {
    playerId: string;
    disciplineId?: string;
    limit?: number;
  }
) {
  const filters = [eq(developmentPlans.playerId, input.playerId)];

  if (input.disciplineId) {
    filters.push(eq(developmentPlans.disciplineId, input.disciplineId));
  }

  return db
    .select()
    .from(developmentPlans)
    .where(and(...filters))
    .orderBy(desc(developmentPlans.createdOn))
    .limit(input.limit ?? 25);
}
