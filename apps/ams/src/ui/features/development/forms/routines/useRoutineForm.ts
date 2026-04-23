"use client";

import { useCallback, useMemo, useState } from "react";

import type {
  RoutineDevelopmentPlanOption,
  RoutineDisciplineOption,
  RoutineDrillOption,
  RoutineMechanicOption,
} from "@ams/application/routines/getRoutineFormConfig";

import {
  cloneRoutineFormValues,
  createEmptyBlock,
  createEmptyDrill,
  createEmptyMechanic,
  createEmptyRoutineFormValues,
  createRoutineFormValuesFromRecord,
} from "./routineForm.defaults";
import { serializeRoutineFormToPayload } from "./routineForm.serialization";
import type {
  RoutineCreateContext,
  RoutineFormContextType,
  RoutineFormErrorMap,
  RoutineFormMode,
  RoutineFormRecord,
  RoutineFormSubmitPayload,
  RoutineFormValues,
  RoutineSubmitAction,
} from "./routineForm.types";
import {
  hasRoutineFormErrors,
  validateRoutineForm,
} from "./routineForm.validation";

type UseRoutineFormParams = {
  mode: RoutineFormMode;
  contextType: RoutineFormContextType;
  createdBy: string;
  initialPlayerId?: string;
  developmentPlanOptions: RoutineDevelopmentPlanOption[];
  disciplineOptions: RoutineDisciplineOption[];
  mechanicOptions: RoutineMechanicOption[];
  drillOptions: RoutineDrillOption[];
  initialDevelopmentPlanId?: string;
  initialDisciplineId?: string;
  initialRoutine?: RoutineFormRecord | null;
  onSaved?: (routineId: string) => void;
};

function getInitialValues(params: UseRoutineFormParams): RoutineFormValues {
  if (params.mode === "edit" && params.initialRoutine) {
    return createRoutineFormValuesFromRecord(params.initialRoutine);
  }

  const initialPlan = params.initialDevelopmentPlanId
    ? params.developmentPlanOptions.find(
        (plan) => plan.id === params.initialDevelopmentPlanId
      )
    : null;

  return createEmptyRoutineFormValues(
    params.initialDevelopmentPlanId,
    initialPlan?.disciplineId ?? params.initialDisciplineId
  );
}

function matchesMechanicDiscipline(
  mechanic: RoutineMechanicOption,
  disciplineKey: string
) {
  if (disciplineKey === "arm_care") {
    return true;
  }

  return mechanic.type === disciplineKey;
}

function matchesDrillDiscipline(drill: RoutineDrillOption, disciplineKey: string) {
  return drill.discipline === disciplineKey;
}

function buildDrillMap(drillOptions: RoutineDrillOption[]) {
  return new Map(drillOptions.map((drill) => [drill.id, drill]));
}

function reorderItems<T extends { sortOrder: number }>(
  items: T[],
  fromIndex: number,
  toIndex: number
): T[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length
  ) {
    return items;
  }

  const next = [...items];
  const [movedItem] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, movedItem);

  return next.map((item, index) => ({
    ...item,
    sortOrder: index,
  }));
}

export function useRoutineForm(params: UseRoutineFormParams) {
  const initialValues = useMemo(() => getInitialValues(params), [params]);
  const [values, setValues] = useState<RoutineFormValues>(initialValues);
  const [errors, setErrors] = useState<RoutineFormErrorMap>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allDrillOptions, setAllDrillOptions] = useState<RoutineDrillOption[]>(
    params.drillOptions
  );
  const [submitAction, setSubmitAction] = useState<RoutineSubmitAction | null>(
    null
  );

  const selectedDevelopmentPlan = useMemo(
    () =>
      params.developmentPlanOptions.find(
        (plan) => plan.id === values.developmentPlanId
      ) ?? null,
    [params.developmentPlanOptions, values.developmentPlanId]
  );

  const selectedDiscipline = useMemo(() => {
    if (params.contextType === "development-plan") {
      if (selectedDevelopmentPlan) {
        return {
          id: selectedDevelopmentPlan.disciplineId,
          key: selectedDevelopmentPlan.disciplineKey,
          label: selectedDevelopmentPlan.disciplineLabel,
        };
      }

      return (
        params.disciplineOptions.find(
          (discipline) => discipline.id === values.disciplineId
        ) ?? null
      );
    }

    return (
      params.disciplineOptions.find(
        (discipline) => discipline.id === values.disciplineId
      ) ?? null
    );
  }, [
    params.contextType,
    params.disciplineOptions,
    selectedDevelopmentPlan,
    values.disciplineId,
  ]);

  const availableMechanicOptions = useMemo(() => {
    if (!selectedDiscipline) {
      return [];
    }

    return params.mechanicOptions.filter((mechanic) =>
      matchesMechanicDiscipline(mechanic, selectedDiscipline.key)
    );
  }, [params.mechanicOptions, selectedDiscipline]);

  const availableDrillOptions = useMemo(() => {
    if (!selectedDiscipline) {
      return [];
    }

    return allDrillOptions.filter((drill) =>
      matchesDrillDiscipline(drill, selectedDiscipline.key)
    );
  }, [allDrillOptions, selectedDiscipline]);

  const availableDrillOptionsById = useMemo(
    () => buildDrillMap(availableDrillOptions),
    [availableDrillOptions]
  );

  const resetForm = useCallback(() => {
    setValues(cloneRoutineFormValues(initialValues));
    setErrors({});
    setSubmitAction(null);
  }, [initialValues]);

  const setFieldValue = useCallback(
    <K extends keyof RoutineFormValues>(key: K, value: RoutineFormValues[K]) => {
      setValues((prev) => {
        if (key === "developmentPlanId" && prev.developmentPlanId !== value) {
          const nextDevelopmentPlanId = value as RoutineFormValues["developmentPlanId"];
          const nextDevelopmentPlan = params.developmentPlanOptions.find(
            (plan) => plan.id === nextDevelopmentPlanId
          );

          return {
            ...prev,
            developmentPlanId: nextDevelopmentPlanId,
            disciplineId: nextDevelopmentPlan?.disciplineId ?? prev.disciplineId,
            mechanics: [],
            blocks: [],
          };
        }

        if (key === "disciplineId" && prev.disciplineId !== value) {
          return {
            ...prev,
            disciplineId: value as RoutineFormValues["disciplineId"],
            mechanics: [],
            blocks: [],
          };
        }

        return {
          ...prev,
          [key]: value,
        };
      });
    },
    [params.developmentPlanOptions]
  );

  const addMechanic = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      mechanics: [...prev.mechanics, createEmptyMechanic()],
    }));
  }, []);

  const updateMechanic = useCallback(
    (index: number, value: Partial<RoutineFormValues["mechanics"][number]>) => {
      setValues((prev) => {
        const next = [...prev.mechanics];
        next[index] = { ...next[index], ...value };
        return { ...prev, mechanics: next };
      });
    },
    []
  );

  const removeMechanic = useCallback((index: number) => {
    setValues((prev) => ({
      ...prev,
      mechanics: prev.mechanics.filter((_, i) => i !== index),
    }));
  }, []);

  const addBlock = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      blocks: [...prev.blocks, createEmptyBlock(prev.blocks.length)],
    }));
  }, []);

  const updateBlock = useCallback(
    (
      index: number,
      value: Partial<Omit<RoutineFormValues["blocks"][number], "drills">>
    ) => {
      setValues((prev) => {
        const next = [...prev.blocks];
        next[index] = { ...next[index], ...value };
        return { ...prev, blocks: next };
      });
    },
    []
  );

  const reorderBlocks = useCallback((fromIndex: number, toIndex: number) => {
    setValues((prev) => ({
      ...prev,
      blocks: reorderItems(prev.blocks, fromIndex, toIndex),
    }));
  }, []);

  const removeBlock = useCallback((index: number) => {
    setValues((prev) => ({
      ...prev,
      blocks: prev.blocks
        .filter((_, i) => i !== index)
        .map((block, i) => ({ ...block, sortOrder: i })),
    }));
  }, []);

  const addDrillsToBlock = useCallback(
    (blockIndex: number, drillIds: string[]) => {
      if (drillIds.length === 0) {
        return;
      }

      setValues((prev) => {
        const nextBlocks = [...prev.blocks];
        const block = nextBlocks[blockIndex];

        if (!block) {
          return prev;
        }

        const existingIds = new Set(block.drills.map((drill) => drill.drillId));
        const drillsToAdd = drillIds
          .filter((drillId) => !existingIds.has(drillId))
          .map((drillId, index) => {
            const option = availableDrillOptionsById.get(drillId);

            return {
              ...createEmptyDrill(block.drills.length + index),
              drillId,
              title: option?.title ?? "",
            };
          });

        if (drillsToAdd.length === 0) {
          return prev;
        }

        nextBlocks[blockIndex] = {
          ...block,
          drills: [...block.drills, ...drillsToAdd],
        };

        return { ...prev, blocks: nextBlocks };
      });
    },
    [availableDrillOptionsById]
  );

  const updateDrillInBlock = useCallback(
    (
      blockIndex: number,
      drillIndex: number,
      value: Partial<RoutineFormValues["blocks"][number]["drills"][number]>
    ) => {
      setValues((prev) => {
        const nextBlocks = [...prev.blocks];
        const block = nextBlocks[blockIndex];
        const nextDrills = [...block.drills];
        nextDrills[drillIndex] = { ...nextDrills[drillIndex], ...value };
        nextBlocks[blockIndex] = { ...block, drills: nextDrills };
        return { ...prev, blocks: nextBlocks };
      });
    },
    []
  );

  const reorderDrillsInBlock = useCallback(
    (blockIndex: number, fromIndex: number, toIndex: number) => {
      setValues((prev) => {
        const nextBlocks = [...prev.blocks];
        const block = nextBlocks[blockIndex];
        nextBlocks[blockIndex] = {
          ...block,
          drills: reorderItems(block.drills, fromIndex, toIndex),
        };
        return { ...prev, blocks: nextBlocks };
      });
    },
    []
  );

  const removeDrillFromBlock = useCallback(
    (blockIndex: number, drillIndex: number) => {
      setValues((prev) => {
        const nextBlocks = [...prev.blocks];
        const block = nextBlocks[blockIndex];
        nextBlocks[blockIndex] = {
          ...block,
          drills: block.drills
            .filter((_, i) => i !== drillIndex)
            .map((drill, i) => ({ ...drill, sortOrder: i })),
        };
        return { ...prev, blocks: nextBlocks };
      });
    },
    []
  );

  const appendDrillOption = useCallback((drill: RoutineDrillOption) => {
    setAllDrillOptions((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === drill.id);

      if (existingIndex === -1) {
        return [...prev, drill];
      }

      const next = [...prev];
      next[existingIndex] = drill;
      return next;
    });
  }, []);

  const buildContext = useCallback((): RoutineCreateContext => {
    if (params.mode === "edit" && params.initialRoutine) {
      if (params.initialRoutine.contextType === "universal") {
        return {
          contextType: "universal",
          createdBy: params.initialRoutine.createdBy,
          discipline: {
            id: params.initialRoutine.disciplineId,
            key: params.initialRoutine.disciplineKey,
            label: params.initialRoutine.disciplineLabel,
          },
        };
      }

      return {
        contextType: "development-plan",
        playerId: params.initialRoutine.playerId ?? params.initialPlayerId ?? "",
        discipline: {
          id: params.initialRoutine.disciplineId,
          key: params.initialRoutine.disciplineKey,
          label: params.initialRoutine.disciplineLabel,
        },
        createdBy: params.initialRoutine.createdBy,
        developmentPlan: params.initialRoutine.developmentPlanId
          ? {
              id: params.initialRoutine.developmentPlanId,
              playerId: params.initialRoutine.playerId ?? params.initialPlayerId ?? "",
              disciplineId: params.initialRoutine.disciplineId,
              disciplineKey: params.initialRoutine.disciplineKey,
              disciplineLabel: params.initialRoutine.disciplineLabel,
              status: "active",
              title: selectedDevelopmentPlan?.title ?? params.initialRoutine.title,
            }
          : null,
      };
    }

    if (params.contextType === "universal") {
      if (!selectedDiscipline) {
        throw new Error("A discipline is required for universal routine creation.");
      }

      return {
        contextType: "universal",
        createdBy: params.createdBy,
        discipline: selectedDiscipline,
      };
    }

    if (!selectedDiscipline) {
      throw new Error("A discipline is required for routine creation.");
    }

    if (!params.initialPlayerId) {
      throw new Error("A player is required for routine creation.");
    }

    return {
      contextType: "development-plan",
      playerId: params.initialPlayerId,
      discipline: selectedDiscipline,
      createdBy: params.createdBy,
      developmentPlan: selectedDevelopmentPlan,
    };
  }, [params, selectedDevelopmentPlan, selectedDiscipline]);

  const handleSubmit = useCallback(
    async (action: RoutineSubmitAction) => {
      setSubmitAction(action);

      const nextErrors = validateRoutineForm(values, {
        mode: params.mode,
        contextType:
          params.mode === "edit" && params.initialRoutine
            ? params.initialRoutine.contextType
            : params.contextType,
      });
      setErrors(nextErrors);

      if (hasRoutineFormErrors(nextErrors)) {
        return;
      }

      setIsSubmitting(true);

      try {
        const context = buildContext();
        const payload: RoutineFormSubmitPayload = serializeRoutineFormToPayload(
          values,
          context
        );

        const baseEndpoint =
          context.contextType === "universal"
            ? "/api/universal-routines"
            : "/api/routines";

        let response: Response;
        if (params.mode === "edit" && params.initialRoutine) {
          response = await fetch(`${baseEndpoint}/${params.initialRoutine.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } else {
          response = await fetch(baseEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }

        if (!response.ok) {
          const result = (await response.json().catch(() => null)) as
            | { error?: string }
            | null;
          throw new Error(result?.error ?? "Failed to save routine.");
        }

        const saved = (await response.json()) as { id: string };
        params.onSaved?.(saved.id);
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          form:
            error instanceof Error ? error.message : "Failed to save routine.",
        }));
      } finally {
        setIsSubmitting(false);
      }
    },
    [buildContext, params, values]
  );

  return {
    mode: params.mode,
    contextType:
      params.mode === "edit" && params.initialRoutine
        ? params.initialRoutine.contextType
        : params.contextType,
    selectedDevelopmentPlan,
    selectedDiscipline,
    allDrillOptions,
    availableMechanicOptions,
    availableDrillOptions,
    values,
    errors,
    isSubmitting,
    submitAction,
    setFieldValue,
    addMechanic,
    updateMechanic,
    removeMechanic,
    addBlock,
    updateBlock,
    reorderBlocks,
    removeBlock,
    addDrillsToBlock,
    appendDrillOption,
    updateDrillInBlock,
    reorderDrillsInBlock,
    removeDrillFromBlock,
    handleSubmit,
    resetForm,
  };
}
