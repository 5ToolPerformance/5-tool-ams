import { listDrillsForLibrary } from "@ams/application/drills/listDrillsForLibrary";
import type { RoutineFormConfig } from "@ams/application/routines/getRoutineFormConfig";
import { listActiveDisciplines } from "@ams/db/queries/config/listActiveDisciplines";
import { getAuthContext } from "@/application/auth/auth-context";
import { createMechanic, deleteMechanic, listMechanics, listMechanicsForLessonForm, updateMechanic } from "@ams/db/queries/mechanics/mechanicsRepository";
import { UniversalRoutineFormPage } from "@/ui/features/routines/UniversalRoutineFormPage";

async function getUniversalRoutineFormConfig(
  facilityId: string,
  viewer: { role: "player" | "coach" | "admin"; userId: string }
): Promise<
  Pick<RoutineFormConfig, "disciplineOptions" | "mechanicOptions" | "drillOptions">
> {
  const [disciplineOptions, mechanicOptions, drillRows] = await Promise.all([
    listActiveDisciplines(),
    listMechanicsForLessonForm(),
    listDrillsForLibrary(facilityId, viewer),
  ]);

  return {
    disciplineOptions,
    mechanicOptions: mechanicOptions.map((mechanic) => ({
      id: mechanic.id,
      name: mechanic.name,
      description: mechanic.description ?? null,
      type: mechanic.type,
      tags: mechanic.tags ?? null,
    })),
    drillOptions: drillRows.map((drill) => ({
      id: drill.id,
      title: drill.title,
      description: drill.description,
      discipline: drill.discipline,
      tags: drill.tags,
    })),
  };
}

export const dynamic = "force-dynamic";

export default async function NewResourceRoutinePage() {
  const ctx = await getAuthContext();
  const config = await getUniversalRoutineFormConfig(ctx.facilityId, {
    role: ctx.role,
    userId: ctx.userId,
  });

  return <UniversalRoutineFormPage createdBy={ctx.userId} config={config} />;
}
