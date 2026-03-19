import db from "@/db";
import { DB } from "@/db";
import { getDrillById } from "@/db/queries/drills/getDrillById";
import { syncDrillTags } from "@/db/queries/drills/syncDrillTags";
import { updateDrill as updateDrillQuery } from "@/db/queries/drills/updateDrill";
import { normalizeDrillWriteInput } from "@/domain/drills/normalize";
import { assertDrillDiscipline } from "@/domain/drills/rules";
import { DrillReadModel, DrillWriteInput } from "@/domain/drills/types";
import { parseYouTubeVideoUrl } from "@/domain/drills/video";

function toReadModel(record: NonNullable<Awaited<ReturnType<typeof getDrillById>>>): DrillReadModel {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    discipline: assertDrillDiscipline(record.discipline),
    videoProvider: record.videoProvider === "youtube" ? "youtube" : null,
    videoId: record.videoId ?? null,
    videoUrl: record.videoUrl ?? null,
    createdBy: {
      id: record.createdBy,
      name: record.creatorName,
    },
    createdOn: record.createdOn.toISOString(),
    updatedOn: record.updatedOn.toISOString(),
    tags: record.tags,
    media: record.media.map((file) => ({
      fileId: file.fileId,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      storageKey: file.storageKey,
      createdOn: file.createdOn.toISOString(),
    })),
  };
}

export async function updateDrill(
  drillId: string,
  input: DrillWriteInput
): Promise<DrillReadModel> {
  const normalized = normalizeDrillWriteInput(input);
  const parsedVideo = parseYouTubeVideoUrl(normalized.videoUrl);

  return db.transaction(async (tx) => {
    const conn = tx as unknown as DB;
    const updated = await updateDrillQuery(
      drillId,
      {
        title: normalized.title,
        description: normalized.description,
        discipline: normalized.discipline,
        videoProvider: parsedVideo?.videoProvider ?? null,
        videoId: parsedVideo?.videoId ?? null,
        videoUrl: parsedVideo?.videoUrl ?? null,
      },
      conn
    );

    if (!updated) {
      throw new Error("Drill not found");
    }

    await syncDrillTags(drillId, normalized.tags, conn);

    const drill = await getDrillById(drillId, conn);

    if (!drill) {
      throw new Error("Drill not found");
    }

    return toReadModel(drill);
  });
}
