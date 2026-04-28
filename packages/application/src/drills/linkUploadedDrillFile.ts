import {
  assertAllowedDrillFile,
  buildDrillStorageKey,
} from "@/application/files/fileUploadPolicy";
import { createDrillFileLink } from "@ams/db/queries/drills/createDrillFileLink";
import { DrillMediaItem } from "@ams/domain/drills/types";

type LinkUploadedDrillFileParams = {
  drillId: string;
  facilityId: string;
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
  const { drillId, facilityId, uploadedBy, file } = params;

  if (!file.fileId || !file.storageKey || !file.originalName) {
    throw new Error("Missing file metadata");
  }

  const extension = assertAllowedDrillFile({
    originalFileName: file.originalName,
    mimeType: file.mimeType,
    size: file.size,
  });
  const expectedStorageKey = buildDrillStorageKey({
    facilityId,
    drillId,
    fileId: file.fileId,
    extension,
  });

  if (file.storageKey !== expectedStorageKey) {
    throw new Error("Invalid file storage key");
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
