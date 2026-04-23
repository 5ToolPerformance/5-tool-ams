import { eq } from "drizzle-orm";

import { DB } from "@/db";
import { developmentPlans } from "@/db/schema";
import { NotFoundError } from "@ams/domain/errors";

export async function getDevelopmentPlanById(
  db: DB,
  developmentPlanId: string
) {
  const [row] = await db
    .select()
    .from(developmentPlans)
    .where(eq(developmentPlans.id, developmentPlanId))
    .limit(1);

  if (!row) {
    throw new NotFoundError("Development plan not found.");
  }

  return row;
}
