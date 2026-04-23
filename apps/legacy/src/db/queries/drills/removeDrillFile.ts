import { and, count, eq } from "drizzle-orm";

import db from "@/db";
import { DB } from "@/db";
import { fileLinks, files } from "@/db/schema";

export async function removeDrillFile(
  drillId: string,
  fileId: string,
  conn: DB = db
) {
  const [link] = await conn
    .select({
      id: fileLinks.id,
    })
    .from(fileLinks)
    .where(
      and(
        eq(fileLinks.entityType, "drill"),
        eq(fileLinks.entityId, drillId),
        eq(fileLinks.fileId, fileId)
      )
    )
    .limit(1);

  if (!link) {
    return {
      removed: false,
      deletedFile: false,
      deletedStorageKey: null as string | null,
    };
  }

  await conn.delete(fileLinks).where(eq(fileLinks.id, link.id));

  const [remainingLinkCount] = await conn
    .select({ total: count() })
    .from(fileLinks)
    .where(eq(fileLinks.fileId, fileId));

  if ((remainingLinkCount?.total ?? 0) > 0) {
    return {
      removed: true,
      deletedFile: false,
      deletedStorageKey: null as string | null,
    };
  }

  const [file] = await conn
    .select({
      id: files.id,
      storageKey: files.storageKey,
    })
    .from(files)
    .where(eq(files.id, fileId))
    .limit(1);

  if (!file) {
    return {
      removed: true,
      deletedFile: false,
      deletedStorageKey: null as string | null,
    };
  }

  await conn.delete(files).where(eq(files.id, fileId));

  return {
    removed: true,
    deletedFile: true,
    deletedStorageKey: file.storageKey,
  };
}
