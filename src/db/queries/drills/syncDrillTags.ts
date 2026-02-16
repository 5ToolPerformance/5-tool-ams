import { eq, inArray } from "drizzle-orm";

import db from "@/db";
import { DB } from "@/db";
import { drillTagLinks, drillTags } from "@/db/schema";

export async function syncDrillTags(
  drillId: string,
  tags: string[],
  conn: DB = db
) {
  await conn.delete(drillTagLinks).where(eq(drillTagLinks.drillId, drillId));

  if (tags.length === 0) {
    return [];
  }

  await conn
    .insert(drillTags)
    .values(tags.map((name) => ({ name })))
    .onConflictDoNothing({
      target: drillTags.name,
    });

  const persistedTags = await conn
    .select({
      id: drillTags.id,
      name: drillTags.name,
    })
    .from(drillTags)
    .where(inArray(drillTags.name, tags));

  if (persistedTags.length === 0) {
    return [];
  }

  await conn.insert(drillTagLinks).values(
    persistedTags.map((tag) => ({
      drillId,
      tagId: tag.id,
    }))
  );

  return persistedTags.map((tag) => tag.name);
}
