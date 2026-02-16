import { v4 as uuidv4 } from "uuid";

import { AzureBlobStorage } from "@/application/storage/azureBlobStorage";
import { createDrillFileLink } from "@/db/queries/drills/createDrillFileLink";
import { isImageMime, isVideoMime } from "@/domain/drills/rules";
import { DrillMediaItem } from "@/domain/drills/types";

const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024;

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

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File too large");
  }

  if (!isImageMime(file.mimeType) && !isVideoMime(file.mimeType)) {
    throw new Error("Only image and video files are allowed");
  }

  const fileId = uuidv4();
  const extension = file.originalFileName.split(".").pop() ?? "bin";
  const storageKey = [
    "drills",
    "facility",
    facilityId,
    "drill",
    drillId,
    `${fileId}.${extension}`,
  ].join("/");

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
