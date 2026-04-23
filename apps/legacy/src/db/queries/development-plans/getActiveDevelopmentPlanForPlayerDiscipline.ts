import { and, eq } from "drizzle-orm";

import { DB } from "@/db";
import { developmentPlans } from "@/db/schema";

export async function getActiveDevelopmentPlanForPlayerDiscipline(
  db: DB,
  input: {
    playerId: string;
    disciplineId: string;
  }
) {
  const [row] = await db
    .select()
    .from(developmentPlans)
    .where(
      and(
        eq(developmentPlans.playerId, input.playerId),
        eq(developmentPlans.disciplineId, input.disciplineId),
        eq(developmentPlans.status, "active")
      )
    )
    .limit(1);

  return row ?? null;
}
