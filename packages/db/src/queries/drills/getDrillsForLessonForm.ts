import { desc } from "drizzle-orm";

import db, { DB } from "@/db";
import { drills } from "@/db/schema";

export async function getDrillsForLessonForm(conn: DB = db) {
  const baseRows = await conn
    .select({
      id: drills.id,
      title: drills.title,
      description: drills.description,
      discipline: drills.discipline,
    })
    .from(drills)
    .orderBy(desc(drills.title));
  return baseRows;
}
