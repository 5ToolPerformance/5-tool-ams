import { and, desc, eq, inArray, sql } from "drizzle-orm";

import db from "@/db";
import { DB } from "@/db";
import { drillTagLinks, drillTags, drills, fileLinks, users } from "@/db/schema";

export async function listDrills(facilityId: string, conn: DB = db) {
  const baseRows = await conn
    .select({
      id: drills.id,
      title: drills.title,
      description: drills.description,
      createdBy: drills.createdBy,
      createdOn: drills.createdOn,
      updatedOn: drills.updatedOn,
      creatorName: users.name,
    })
    .from(drills)
    .innerJoin(users, eq(drills.createdBy, users.id))
    .where(eq(users.facilityId, facilityId))
    .orderBy(desc(drills.updatedOn));

  if (baseRows.length === 0) {
    return [];
  }

  const drillIds = baseRows.map((row) => row.id);

  const [tagRows, mediaCountRows] = await Promise.all([
    conn
      .select({
        drillId: drillTagLinks.drillId,
        tag: drillTags.name,
      })
      .from(drillTagLinks)
      .innerJoin(drillTags, eq(drillTagLinks.tagId, drillTags.id))
      .where(inArray(drillTagLinks.drillId, drillIds)),
    conn
      .select({
        drillId: fileLinks.entityId,
        mediaCount: sql<number>`count(*)`.mapWith(Number),
      })
      .from(fileLinks)
      .where(
        and(
          eq(fileLinks.entityType, "drill"),
          inArray(fileLinks.entityId, drillIds)
        )
      )
      .groupBy(fileLinks.entityId),
  ]);

  const tagsByDrillId = new Map<string, string[]>();
  for (const row of tagRows) {
    const existing = tagsByDrillId.get(row.drillId) ?? [];
    existing.push(row.tag);
    tagsByDrillId.set(row.drillId, existing);
  }

  const mediaCountByDrillId = new Map<string, number>(
    mediaCountRows.map((row) => [row.drillId, row.mediaCount])
  );

  return baseRows.map((row) => ({
    ...row,
    tags: tagsByDrillId.get(row.id) ?? [],
    mediaCount: mediaCountByDrillId.get(row.id) ?? 0,
  }));
}
