import db from "@/db";
import { DB } from "@/db";
import { createDrill as createDrillQuery } from "@/db/queries/drills/createDrill";
import { getDrillById } from "@/db/queries/drills/getDrillById";
import { syncDrillTags } from "@/db/queries/drills/syncDrillTags";
import { normalizeDrillWriteInput } from "@/domain/drills/normalize";
import { DrillReadModel, DrillWriteInput } from "@/domain/drills/types";

function toReadModel(record: NonNullable<Awaited<ReturnType<typeof getDrillById>>>): DrillReadModel {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
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

  return db.transaction(async (tx) => {
    const conn = tx as unknown as DB;
    const created = await createDrillQuery(
      {
        title: normalized.title,
        description: normalized.description,
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
