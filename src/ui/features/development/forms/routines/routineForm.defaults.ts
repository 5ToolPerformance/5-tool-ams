import type {
  RoutineFormBlock,
  RoutineFormDrill,
  RoutineFormMechanic,
  RoutineFormRecord,
  RoutineFormValues,
} from "./routineForm.types";

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createEmptyRoutineFormValues(
  initialDevelopmentPlanId = ""
): RoutineFormValues {
  return {
    developmentPlanId: initialDevelopmentPlanId,
    title: "",
    description: "",
    routineType: "partial_lesson",
    sortOrder: 0,
    isActive: true,
    summary: "",
    usageNotes: "",
    mechanics: [],
    blocks: [],
  };
}

export function createRoutineFormValuesFromRecord(
  routine: RoutineFormRecord
): RoutineFormValues {
  const doc = routine.documentData;

  return {
    developmentPlanId: routine.developmentPlanId,
    title: routine.title ?? "",
    description: routine.description ?? "",
    routineType: routine.routineType,
    sortOrder: routine.sortOrder ?? 0,
    isActive: routine.isActive,
    summary: doc?.overview?.summary ?? "",
    usageNotes: doc?.overview?.usageNotes ?? "",
    mechanics: (doc?.mechanics ?? []).map((item) => ({
      id: createId("mechanic"),
      mechanicId: item.mechanicId ?? "",
      title: item.title ?? "",
    })),
    blocks: (doc?.blocks ?? []).map((block, blockIndex) => ({
      id: block.id ?? createId(`block_${blockIndex}`),
      title: block.title ?? "",
      notes: block.notes ?? "",
      sortOrder: block.sortOrder ?? blockIndex,
      drills: (block.drills ?? []).map((drill, drillIndex) => ({
        id: createId(`drill_${blockIndex}_${drillIndex}`),
        drillId: drill.drillId ?? "",
        title: drill.title ?? "",
        notes: drill.notes ?? "",
        sortOrder: drill.sortOrder ?? drillIndex,
      })),
    })),
  };
}

export function cloneRoutineFormValues(values: RoutineFormValues): RoutineFormValues {
  return {
    ...values,
    mechanics: values.mechanics.map((item) => ({ ...item })),
    blocks: values.blocks.map((block) => ({
      ...block,
      drills: block.drills.map((drill) => ({ ...drill })),
    })),
  };
}

export function createEmptyMechanic(): RoutineFormMechanic {
  return {
    id: createId("mechanic"),
    mechanicId: "",
    title: "",
  };
}

export function createEmptyDrill(sortOrder = 0): RoutineFormDrill {
  return {
    id: createId("drill"),
    drillId: "",
    title: "",
    notes: "",
    sortOrder,
  };
}

export function createEmptyBlock(sortOrder = 0): RoutineFormBlock {
  return {
    id: createId("block"),
    title: "",
    notes: "",
    sortOrder,
    drills: [],
  };
}
