import { notFound } from "next/navigation";

import db from "@ams/db";
import { listDrillsForLibrary } from "@ams/application/drills/listDrillsForLibrary";
import type { RoutineFormConfig } from "@ams/application/routines/getRoutineFormConfig";
import { listActiveDisciplines } from "@ams/db/queries/config/listActiveDisciplines";
import { getUniversalRoutineById } from "@ams/db/queries/routines/getUniversalRoutineById";
import {
  assertCanEditUniversalRoutine,
  AuthError,
  getAuthContext,
} from "@/application/auth/auth-context";
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

export default async function EditResourceRoutinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const ctx = await getAuthContext();
  const { id } = await params;

  try {
    await assertCanEditUniversalRoutine(ctx, id);
  } catch (error) {
    if (error instanceof AuthError && (error.status === 403 || error.status === 404)) {
      notFound();
    }
    throw error;
  }

  const [routine, config] = await Promise.all([
    getUniversalRoutineById(db, id),
    getUniversalRoutineFormConfig(ctx.facilityId, {
      role: ctx.role,
      userId: ctx.userId,
    }),
  ]);

  return (
    <UniversalRoutineFormPage
      createdBy={ctx.userId}
      config={config}
      initialRoutine={{
        id: routine.id,
        contextType: "universal",
        disciplineId: routine.disciplineId,
        disciplineKey: routine.disciplineKey,
        disciplineLabel: routine.disciplineLabel,
        createdBy: routine.createdBy,
        title: routine.title,
        description: routine.description,
        routineType: routine.routineType,
        sortOrder: routine.sortOrder,
        isActive: routine.isActive,
        documentData: routine.documentData as any,
      }}
    />
  );
}
