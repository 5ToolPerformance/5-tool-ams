import { getDrillById } from "@ams/db/queries/drills/getDrillById";
import { assertDrillDiscipline } from "@ams/domain/drills/rules";
import { DrillReadModel } from "@ams/domain/drills/types";

export async function getDrillForEdit(drillId: string): Promise<DrillReadModel> {
  const drill = await getDrillById(drillId);

  if (!drill) {
    throw new Error("Drill not found");
  }

  return {
    id: drill.id,
    title: drill.title,
    description: drill.description,
    discipline: assertDrillDiscipline(drill.discipline),
    videoProvider: drill.videoProvider === "youtube" ? "youtube" : null,
    videoId: drill.videoId ?? null,
    videoUrl: drill.videoUrl ?? null,
    createdBy: {
      id: drill.createdBy,
      name: drill.creatorName,
    },
    createdOn: drill.createdOn.toISOString(),
    updatedOn: drill.updatedOn.toISOString(),
    tags: drill.tags,
    media: drill.media.map((file) => ({
      fileId: file.fileId,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      storageKey: file.storageKey,
      createdOn: file.createdOn.toISOString(),
    })),
  };
}
