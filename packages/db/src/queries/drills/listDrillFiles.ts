import { and, eq } from "drizzle-orm";

import db from "@/db";
import { DB } from "@/db";
import { fileLinks, files } from "@/db/schema";

export async function listDrillFiles(drillId: string, conn: DB = db) {
  return conn
    .select({
      fileId: files.id,
      originalName: files.originalName,
      mimeType: files.mimeType,
      size: files.size,
      storageKey: files.storageKey,
      createdOn: files.createdOn,
    })
    .from(fileLinks)
    .innerJoin(files, eq(fileLinks.fileId, files.id))
    .where(
      and(eq(fileLinks.entityType, "drill"), eq(fileLinks.entityId, drillId))
    );
}
