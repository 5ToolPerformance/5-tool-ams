import { v4 as uuidv4 } from "uuid";

import { AzureBlobStorage } from "@/application/storage/azureBlobStorage";
import { isImageMime, isVideoMime } from "@/domain/drills/rules";

const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024;

type PrepareDrillFileUploadParams = {
  drillId: string;
  facilityId: string;
  file: {
    originalFileName: string;
    mimeType: string;
    size: number;
  };
};

export async function prepareDrillFileUpload(
  params: PrepareDrillFileUploadParams
) {
  const { drillId, facilityId, file } = params;

  if (!file.originalFileName?.trim()) {
    throw new Error("Missing file name");
  }

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
  const uploadUrl = storage.getUploadUrl(storageKey, 15);

  return {
    fileId,
    storageKey,
    uploadUrl,
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "Content-Type": file.mimeType,
    },
  };
}
