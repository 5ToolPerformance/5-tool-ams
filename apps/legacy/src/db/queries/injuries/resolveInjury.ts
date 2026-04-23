import { eq } from "drizzle-orm";

import { DB } from "@/db";
import { injury } from "@/db/schema";

export async function resolveInjury(
  db: DB,
  injuryId: string,
  resolvedAt: string
) {
  return db
    .update(injury)
    .set({
      status: "resolved",
      endDate: resolvedAt,
    })
    .where(eq(injury.id, injuryId))
    .returning();
}
