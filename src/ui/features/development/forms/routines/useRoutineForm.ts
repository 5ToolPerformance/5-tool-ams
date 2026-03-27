"use client";

import { useCallback, useMemo, useState } from "react";

import type {
  RoutineDevelopmentPlanOption,
  RoutineDisciplineOption,
  RoutineDrillOption,
  RoutineMechanicOption,
} from "@/application/routines/getRoutineFormConfig";

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

  return createEmptyRoutineFormValues(
    params.initialDevelopmentPlanId,
    params.initialDisciplineId
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

export function useRoutineForm(params: UseRoutineFormParams) {
  const initialValues = useMemo(() => getInitialValues(params), [params]);
  const [values, setValues] = useState<RoutineFormValues>(initialValues);
  const [errors, setErrors] = useState<RoutineFormErrorMap>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      if (!selectedDevelopmentPlan) {
        return null;
      }

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
  }, [params.contextType, params.disciplineOptions, selectedDevelopmentPlan, values.disciplineId]);

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

    return params.drillOptions.filter((drill) =>
      matchesDrillDiscipline(drill, selectedDiscipline.key)
    );
  }, [params.drillOptions, selectedDiscipline]);

  const resetForm = useCallback(() => {
    setValues(cloneRoutineFormValues(initialValues));
    setErrors({});
    setSubmitAction(null);
  }, [initialValues]);

  const setFieldValue = useCallback(
    <K extends keyof RoutineFormValues>(key: K, value: RoutineFormValues[K]) => {
      setValues((prev) => {
        if (key === "developmentPlanId" && prev.developmentPlanId !== value) {
          return {
            ...prev,
            developmentPlanId: value as RoutineFormValues["developmentPlanId"],
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
    []
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

  const removeBlock = useCallback((index: number) => {
    setValues((prev) => ({
      ...prev,
      blocks: prev.blocks
        .filter((_, i) => i !== index)
        .map((block, i) => ({ ...block, sortOrder: i })),
    }));
  }, []);

  const addDrillToBlock = useCallback((blockIndex: number) => {
    setValues((prev) => {
      const nextBlocks = [...prev.blocks];
      const block = nextBlocks[blockIndex];
      nextBlocks[blockIndex] = {
        ...block,
        drills: [...block.drills, createEmptyDrill(block.drills.length)],
      };
      return { ...prev, blocks: nextBlocks };
    });
  }, []);

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
        createdBy: params.initialRoutine.createdBy,
        developmentPlan: {
          id: params.initialRoutine.developmentPlanId ?? "",
          playerId: params.initialRoutine.playerId ?? "",
          disciplineId: params.initialRoutine.disciplineId,
          disciplineKey: params.initialRoutine.disciplineKey,
          disciplineLabel: params.initialRoutine.disciplineLabel,
          status: "active",
          title:
            selectedDevelopmentPlan?.title ?? params.initialRoutine.title,
        },
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

    if (!selectedDevelopmentPlan) {
      throw new Error("A development plan is required for routine creation.");
    }

    return {
      contextType: "development-plan",
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
    contextType: params.mode === "edit" && params.initialRoutine
      ? params.initialRoutine.contextType
      : params.contextType,
    selectedDevelopmentPlan,
    selectedDiscipline,
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
    removeBlock,
    addDrillToBlock,
    updateDrillInBlock,
    removeDrillFromBlock,
    handleSubmit,
    resetForm,
  };
}
