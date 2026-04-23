import { DB } from "@ams/db";
import { getDevelopmentPlanById } from "@ams/db/queries/development-plans/getDevelopmentPlanById";
import { createRoutine } from "@ams/db/queries/routines/createRoutine";
import { getUniversalRoutineById } from "@ams/db/queries/routines/getUniversalRoutineById";
import { RoutineDocumentV1 } from "@ams/domain/routines/types";
import { DomainError } from "@ams/domain/errors";

function withTemplateSource(
  documentData: unknown,
  universalRoutineId: string
): Record<string, unknown> | null {
  const current =
    documentData && typeof documentData === "object" && !Array.isArray(documentData)
      ? ({ ...documentData } as Record<string, unknown>)
      : null;

  if (!current) {
    return null;
  }

  current.templateSource = {
    type: "universal_routine",
    universalRoutineId,
    copiedAt: new Date().toISOString(),
  } satisfies RoutineDocumentV1["templateSource"];

  return current;
}

export async function assignUniversalRoutineToDevelopmentPlan(
  db: DB,
  input: {
    developmentPlanId: string;
    universalRoutineId: string;
    assignedBy: string;
  }
) {
  const [plan, universalRoutine] = await Promise.all([
    getDevelopmentPlanById(db, input.developmentPlanId),
    getUniversalRoutineById(db, input.universalRoutineId),
  ]);

  if (plan.disciplineId !== universalRoutine.disciplineId) {
    throw new DomainError(
      "Universal routine discipline must match the development plan discipline."
    );
  }

  return createRoutine(db, {
    playerId: plan.playerId,
    disciplineId: plan.disciplineId,
    developmentPlanId: plan.id,
    createdBy: input.assignedBy,
    title: universalRoutine.title,
    description: universalRoutine.description,
    routineType: universalRoutine.routineType,
    sortOrder: universalRoutine.sortOrder,
    isActive: universalRoutine.isActive,
    documentData: withTemplateSource(
      universalRoutine.documentData,
      universalRoutine.id
    ),
  });
}
