import { and, eq, ne } from "drizzle-orm";

import { DB } from "@/db";
import { injury } from "@/db/schema";

export async function getActivePlayerInjuries(db: DB, playerId: string) {
  return db
    .select()
    .from(injury)
    .where(and(eq(injury.playerId, playerId), ne(injury.status, "resolved")));
}
