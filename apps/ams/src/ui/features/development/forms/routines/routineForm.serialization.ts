import { RoutineDocumentV1 } from "@ams/domain/routines/types";

import type {
  RoutineCreateContext,
  RoutineFormSubmitPayload,
  RoutineFormValues,
} from "./routineForm.types";

function emptyToUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function serializeRoutineFormToDocumentData(
  values: RoutineFormValues,
  context: RoutineCreateContext
): RoutineDocumentV1 {
  const mechanics = values.mechanics
    .filter((item) => item.mechanicId.trim())
    .map((item) => ({
      mechanicId: item.mechanicId.trim(),
      title: emptyToUndefined(item.title),
    }));

  const blocks = values.blocks
    .filter((block) => block.title.trim())
    .map((block, blockIndex) => ({
      id: block.id,
      title: block.title.trim(),
      notes: emptyToUndefined(block.notes),
      sortOrder: blockIndex,
      drills: block.drills
        .filter((drill) => drill.drillId.trim())
        .map((drill, drillIndex) => ({
          drillId: drill.drillId.trim(),
          title: emptyToUndefined(drill.title),
          notes: emptyToUndefined(drill.notes),
          sortOrder: drillIndex,
        })),
    }));

  if (context.contextType === "universal") {
    return {
      version: 1,
      visibility: "universal",
      disciplineId: context.discipline.id,
      overview: {
        summary: emptyToUndefined(values.summary),
        usageNotes: emptyToUndefined(values.usageNotes),
      },
      mechanics,
      blocks,
    };
  }

  return {
    version: 1,
    visibility: "player",
    playerId: context.playerId,
    disciplineId: context.discipline.id,
    overview: {
      summary: emptyToUndefined(values.summary),
      usageNotes: emptyToUndefined(values.usageNotes),
    },
    mechanics,
    blocks,
  };
}

export function serializeRoutineFormToPayload(
  values: RoutineFormValues,
  context: RoutineCreateContext
): RoutineFormSubmitPayload {
  return {
    playerId:
      context.contextType === "development-plan" ? context.playerId : undefined,
    developmentPlanId:
      context.contextType === "development-plan"
        ? context.developmentPlan?.id
        : undefined,
    disciplineId: context.discipline.id,
    createdBy: context.createdBy,
    title: values.title.trim(),
    description: emptyToNull(values.description),
    routineType: values.routineType,
    sortOrder: values.sortOrder,
    isActive: values.isActive,
    documentData: serializeRoutineFormToDocumentData(values, context),
  };
}
