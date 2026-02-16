import { eq } from "drizzle-orm";

import db from "@/db";
import { DB } from "@/db";
import { drills } from "@/db/schema";

type UpdateDrillValues = {
  title: string;
  description: string;
  discipline: "hitting" | "pitching" | "strength" | "fielding" | "catching" | "arm_care";
};

export async function updateDrill(
  drillId: string,
  values: UpdateDrillValues,
  conn: DB = db
) {
  const [updated] = await conn
    .update(drills)
    .set({
      ...values,
      updatedOn: new Date(),
    })
    .where(eq(drills.id, drillId))
    .returning();

  return updated ?? null;
}
