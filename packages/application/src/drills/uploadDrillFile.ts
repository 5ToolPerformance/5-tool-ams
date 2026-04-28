import { v4 as uuidv4 } from "uuid";

import {
  assertAllowedDrillFile,
  buildDrillStorageKey,
} from "@/application/files/fileUploadPolicy";
import { AzureBlobStorage } from "@/application/storage/azureBlobStorage";
import { createDrillFileLink } from "@ams/db/queries/drills/createDrillFileLink";
import { DrillMediaItem } from "@ams/domain/drills/types";

type UploadDrillFileParams = {
  drillId: string;
  facilityId: string;
  uploadedBy: string;
  file: {
    buffer: Buffer;
    originalFileName: string;
    mimeType: string;
    size: number;
  };
};

export async function uploadDrillFile(
  params: UploadDrillFileParams
): Promise<DrillMediaItem> {
  const { drillId, facilityId, uploadedBy, file } = params;

  const extension = assertAllowedDrillFile(file);

  const fileId = uuidv4();
  const storageKey = buildDrillStorageKey({
    facilityId,
    drillId,
    fileId,
    extension,
  });

  const storage = new AzureBlobStorage();
  await storage.uploadFile({
    buffer: file.buffer,
    storageKey,
    mimeType: file.mimeType,
  });

  try {
    const createdFile = await createDrillFileLink({
      drillId,
      fileId,
      storageKey,
      originalName: file.originalFileName,
      mimeType: file.mimeType,
      size: file.size,
      uploadedBy,
    });

    return {
      fileId: createdFile.id,
      originalName: createdFile.originalName,
      mimeType: createdFile.mimeType,
      size: createdFile.size,
      storageKey: createdFile.storageKey,
      createdOn: createdFile.createdOn.toISOString(),
    };
  } catch (error) {
    await storage.deleteFile(storageKey);
    throw error;
  }
}
