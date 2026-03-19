import { asc, eq, sql } from "drizzle-orm";

import db, { DB } from "@/db";
import { buckets } from "@/db/schema";

export async function listActiveBuckets(conn: DB = db) {
  return conn
    .select({
      id: buckets.id,
      disciplineId: buckets.disciplineId,
      key: buckets.key,
      label: buckets.label,
      description: buckets.description,
      sortOrder: buckets.sortOrder,
      active: buckets.active,
    })
    .from(buckets)
    .where(eq(buckets.active, true))
    .orderBy(
      asc(buckets.disciplineId),
      asc(sql`coalesce(${buckets.sortOrder}, 2147483647)`),
      asc(buckets.label)
    );
}
