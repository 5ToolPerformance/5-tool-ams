import { and, eq, inArray } from "drizzle-orm";

import db, { DB } from "@/db";
import { buckets } from "@/db/schema";

export async function listBucketsByIds(
  bucketIds: string[],
  disciplineId: string,
  conn: DB = db
) {
  if (bucketIds.length === 0) {
    return [];
  }

  return conn
    .select({
      id: buckets.id,
    })
    .from(buckets)
    .where(
      and(
        inArray(buckets.id, bucketIds),
        eq(buckets.disciplineId, disciplineId)
      )
    );
}
