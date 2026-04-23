import db from "@ams/db";
import { DB } from "@ams/db";
import { createDrill as createDrillQuery } from "@ams/db/queries/drills/createDrill";
import { getDrillById } from "@ams/db/queries/drills/getDrillById";
import { syncDrillTags } from "@ams/db/queries/drills/syncDrillTags";
import { normalizeDrillWriteInput } from "@ams/domain/drills/normalize";
import { assertDrillDiscipline } from "@ams/domain/drills/rules";
import { DrillReadModel, DrillWriteInput } from "@ams/domain/drills/types";
import { parseYouTubeVideoUrl } from "@ams/domain/drills/video";

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

export async function createDrill(
  input: DrillWriteInput,
  createdBy: string
): Promise<DrillReadModel> {
  const normalized = normalizeDrillWriteInput(input);
  const parsedVideo = parseYouTubeVideoUrl(normalized.videoUrl);

  return db.transaction(async (tx) => {
    const conn = tx as unknown as DB;
    const created = await createDrillQuery(
      {
        title: normalized.title,
        description: normalized.description,
        discipline: normalized.discipline,
        videoProvider: parsedVideo?.videoProvider ?? null,
        videoId: parsedVideo?.videoId ?? null,
        videoUrl: parsedVideo?.videoUrl ?? null,
        createdBy,
      },
      conn
    );

    await syncDrillTags(created.id, normalized.tags, conn);

    const drill = await getDrillById(created.id, conn);

    if (!drill) {
      throw new Error("Failed to create drill");
    }

    return toReadModel(drill);
  });
}
