import { createDrillFileLink } from "@/db/queries/drills/createDrillFileLink";
import { isImageMime, isVideoMime } from "@/domain/drills/rules";
import { DrillMediaItem } from "@/domain/drills/types";

const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024;

type LinkUploadedDrillFileParams = {
  drillId: string;
  uploadedBy: string;
  file: {
    fileId: string;
    storageKey: string;
    originalName: string;
    mimeType: string;
    size: number;
  };
};

export async function linkUploadedDrillFile(
  params: LinkUploadedDrillFileParams
): Promise<DrillMediaItem> {
  const { drillId, uploadedBy, file } = params;

  if (!file.fileId || !file.storageKey || !file.originalName) {
    throw new Error("Missing file metadata");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File too large");
  }

  if (!isImageMime(file.mimeType) && !isVideoMime(file.mimeType)) {
    throw new Error("Only image and video files are allowed");
  }

  const createdFile = await createDrillFileLink({
    drillId,
    fileId: file.fileId,
    storageKey: file.storageKey,
    originalName: file.originalName,
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
}
