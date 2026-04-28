import { v4 as uuidv4 } from "uuid";

import { AzureBlobStorage } from "@/application/storage/azureBlobStorage";
import {
  assertAllowedDrillFile,
  buildDrillStorageKey,
} from "@/application/files/fileUploadPolicy";

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

  const extension = assertAllowedDrillFile(file);

  const fileId = uuidv4();
  const storageKey = buildDrillStorageKey({
    facilityId,
    drillId,
    fileId,
    extension,
  });

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
