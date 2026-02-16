import { eq } from "drizzle-orm";

import db from "@/db";
import { DB } from "@/db";
import { drillTagLinks, drillTags, drills, users } from "@/db/schema";

import { listDrillFiles } from "./listDrillFiles";

export async function getDrillById(drillId: string, conn: DB = db) {
  const [base] = await conn
    .select({
      id: drills.id,
      title: drills.title,
      description: drills.description,
      createdBy: drills.createdBy,
      createdOn: drills.createdOn,
      updatedOn: drills.updatedOn,
      creatorName: users.name,
      creatorFacilityId: users.facilityId,
    })
    .from(drills)
    .innerJoin(users, eq(drills.createdBy, users.id))
    .where(eq(drills.id, drillId))
    .limit(1);

  if (!base) {
    return null;
  }

  const [tags, media] = await Promise.all([
    conn
      .select({
        name: drillTags.name,
      })
      .from(drillTagLinks)
      .innerJoin(drillTags, eq(drillTagLinks.tagId, drillTags.id))
      .where(eq(drillTagLinks.drillId, drillId)),
    listDrillFiles(drillId, conn),
  ]);

  return {
    ...base,
    tags: tags.map((tag) => tag.name),
    media,
  };
}
