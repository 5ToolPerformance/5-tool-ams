import { AzureBlobStorage } from "@/application/storage/azureBlobStorage";
import { removeDrillFile as removeDrillFileQuery } from "@/db/queries/drills/removeDrillFile";

export async function removeDrillFile(drillId: string, fileId: string) {
  const result = await removeDrillFileQuery(drillId, fileId);

  if (result.deletedFile && result.deletedStorageKey) {
    const storage = new AzureBlobStorage();
    try {
      await storage.deleteFile(result.deletedStorageKey);
    } catch (error) {
      console.error("Failed to delete drill blob:", error);
    }
  }

  return result;
}
