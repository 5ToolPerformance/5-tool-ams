import db from "@/db";
import { DB } from "@/db";
import { fileLinks, files } from "@/db/schema";

type CreateDrillFileLinkValues = {
  drillId: string;
  fileId: string;
  storageKey: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
};

export async function createDrillFileLink(
  values: CreateDrillFileLinkValues,
  conn: DB = db
) {
  const [createdFile] = await conn
    .insert(files)
    .values({
      id: values.fileId,
      storageKey: values.storageKey,
      originalName: values.originalName,
      mimeType: values.mimeType,
      size: values.size,
      uploadedBy: values.uploadedBy,
      kind: "original",
    })
    .returning();

  await conn.insert(fileLinks).values({
    fileId: values.fileId,
    entityType: "drill",
    entityId: values.drillId,
  });

  return createdFile;
}
