import { listDrills } from "@ams/db/queries/drills/listDrills";
import { assertDrillDiscipline, canCoachEditDrill } from "@ams/domain/drills/rules";
import { DrillListItem } from "@ams/domain/drills/types";
import { AuthContext } from "@/application/auth/auth-context";

export async function listDrillsForLibrary(
  facilityId: string,
  viewer: Pick<AuthContext, "role" | "userId">
): Promise<DrillListItem[]> {
  const drills = await listDrills(facilityId);

  return drills.map((drill) => ({
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
    mediaCount: drill.mediaCount,
    canEdit:
      viewer.role === "admin" ||
      canCoachEditDrill(drill.createdBy, viewer.userId),
  }));
}
