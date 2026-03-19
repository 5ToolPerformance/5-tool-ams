import { eq } from "drizzle-orm";

import db from "@/db";
import { DB } from "@/db";
import { drills } from "@/db/schema";

export async function deleteDrill(drillId: string, conn: DB = db) {
  const [deleted] = await conn
    .delete(drills)
    .where(eq(drills.id, drillId))
    .returning({ id: drills.id });

  return deleted ?? null;
}
