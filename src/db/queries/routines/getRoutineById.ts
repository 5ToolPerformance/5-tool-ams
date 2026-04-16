import { eq } from "drizzle-orm";

import { DB } from "@/db";
import { developmentPlanRoutines } from "@/db/schema";
import { NotFoundError } from "@/domain/errors";

export async function getRoutineById(db: DB, routineId: string) {
  const [row] = await db
    .select()
    .from(developmentPlanRoutines)
    .where(eq(developmentPlanRoutines.id, routineId))
    .limit(1);

  if (!row) {
    throw new NotFoundError("Routine not found.");
  }

  return row;
}
