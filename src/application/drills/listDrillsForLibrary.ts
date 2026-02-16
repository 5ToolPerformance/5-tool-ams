import { listDrills } from "@/db/queries/drills/listDrills";
import { assertDrillDiscipline, canCoachEditDrill } from "@/domain/drills/rules";
import { DrillListItem } from "@/domain/drills/types";
import { AuthContext } from "@/lib/auth/auth-context";

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
