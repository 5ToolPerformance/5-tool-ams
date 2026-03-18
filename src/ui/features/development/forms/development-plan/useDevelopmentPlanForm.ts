"use client";

import { useCallback, useMemo, useState } from "react";

import {
  cloneDevelopmentPlanFormValues,
  createDevelopmentPlanFormValuesFromRecord,
  createEmptyDevelopmentPlanFormValues,
  createEmptyDevelopmentPlanListItem,
  createEmptyMeasurableIndicator,
} from "./developmentPlanForm.defaults";
import { serializeDevelopmentPlanFormToPayload } from "./developmentPlanForm.serialization";
import type {
  DevelopmentPlanCreateContext,
  DevelopmentPlanFormErrorMap,
  DevelopmentPlanFormMode,
  DevelopmentPlanFormRecord,
  DevelopmentPlanFormSubmitPayload,
  DevelopmentPlanFormValues,
  DevelopmentPlanSubmitAction,
  DevelopmentPlanEvaluationOption,
} from "./developmentPlanForm.types";
import {
  hasDevelopmentPlanFormErrors,
  validateDevelopmentPlanForm,
} from "./developmentPlanForm.validation";

type UseDevelopmentPlanFormParams = {
  mode: DevelopmentPlanFormMode;
  playerId?: string;
  createdBy: string;
  evaluationOptions: DevelopmentPlanEvaluationOption[];
  initialEvaluationId?: string;
  initialDevelopmentPlan?: DevelopmentPlanFormRecord | null;
  onSaved?: (developmentPlanId: string) => void;
  onSavedAndContinue?: (developmentPlanId: string) => void;
};

function getInitialValues(
  params: UseDevelopmentPlanFormParams
): DevelopmentPlanFormValues {
  if (params.mode === "edit" && params.initialDevelopmentPlan) {
    return createDevelopmentPlanFormValuesFromRecord(
      params.initialDevelopmentPlan
    );
  }

  return createEmptyDevelopmentPlanFormValues(params.initialEvaluationId);
}

export function useDevelopmentPlanForm(params: UseDevelopmentPlanFormParams) {
  const initialValues = useMemo(() => getInitialValues(params), [params]);
  const [values, setValues] =
    useState<DevelopmentPlanFormValues>(initialValues);
  const [errors, setErrors] = useState<DevelopmentPlanFormErrorMap>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAction, setSubmitAction] =
    useState<DevelopmentPlanSubmitAction | null>(null);

  const selectedEvaluation = useMemo(
    () =>
      params.evaluationOptions.find(
        (evaluation) => evaluation.id === values.evaluationId
      ) ?? null,
    [params.evaluationOptions, values.evaluationId]
  );

  const resetForm = useCallback(() => {
    setValues(cloneDevelopmentPlanFormValues(initialValues));
    setErrors({});
    setSubmitAction(null);
  }, [initialValues]);

  const setFieldValue = useCallback(
    <K extends keyof DevelopmentPlanFormValues>(
      key: K,
      value: DevelopmentPlanFormValues[K]
    ) => {
      setValues((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const addShortTermGoal = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      shortTermGoals: [
        ...prev.shortTermGoals,
        createEmptyDevelopmentPlanListItem("stg"),
      ],
    }));
  }, []);

  const updateShortTermGoal = useCallback(
    (
      index: number,
      value: Partial<DevelopmentPlanFormValues["shortTermGoals"][number]>
    ) => {
      setValues((prev) => {
        const next = [...prev.shortTermGoals];
        next[index] = { ...next[index], ...value };
        return { ...prev, shortTermGoals: next };
      });
    },
    []
  );

  const removeShortTermGoal = useCallback((index: number) => {
    setValues((prev) => ({
      ...prev,
      shortTermGoals: prev.shortTermGoals.filter((_, i) => i !== index),
    }));
  }, []);

  const addLongTermGoal = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      longTermGoals: [
        ...prev.longTermGoals,
        createEmptyDevelopmentPlanListItem("ltg"),
      ],
    }));
  }, []);

  const updateLongTermGoal = useCallback(
    (
      index: number,
      value: Partial<DevelopmentPlanFormValues["longTermGoals"][number]>
    ) => {
      setValues((prev) => {
        const next = [...prev.longTermGoals];
        next[index] = { ...next[index], ...value };
        return { ...prev, longTermGoals: next };
      });
    },
    []
  );

  const removeLongTermGoal = useCallback((index: number) => {
    setValues((prev) => ({
      ...prev,
      longTermGoals: prev.longTermGoals.filter((_, i) => i !== index),
    }));
  }, []);

  const addFocusArea = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      focusAreas: [
        ...prev.focusAreas,
        createEmptyDevelopmentPlanListItem("focus"),
      ],
    }));
  }, []);

  const updateFocusArea = useCallback(
    (
      index: number,
      value: Partial<DevelopmentPlanFormValues["focusAreas"][number]>
    ) => {
      setValues((prev) => {
        const next = [...prev.focusAreas];
        next[index] = { ...next[index], ...value };
        return { ...prev, focusAreas: next };
      });
    },
    []
  );

  const removeFocusArea = useCallback((index: number) => {
    setValues((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.filter((_, i) => i !== index),
    }));
  }, []);

  const addMeasurableIndicator = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      measurableIndicators: [
        ...prev.measurableIndicators,
        createEmptyMeasurableIndicator(),
      ],
    }));
  }, []);

  const updateMeasurableIndicator = useCallback(
    (
      index: number,
      value: Partial<DevelopmentPlanFormValues["measurableIndicators"][number]>
    ) => {
      setValues((prev) => {
        const next = [...prev.measurableIndicators];
        next[index] = { ...next[index], ...value };
        return { ...prev, measurableIndicators: next };
      });
    },
    []
  );

  const removeMeasurableIndicator = useCallback((index: number) => {
    setValues((prev) => ({
      ...prev,
      measurableIndicators: prev.measurableIndicators.filter(
        (_, i) => i !== index
      ),
    }));
  }, []);

  const buildContext = useCallback((): DevelopmentPlanCreateContext => {
    if (params.mode === "edit" && params.initialDevelopmentPlan) {
      return {
        playerId: params.initialDevelopmentPlan.playerId,
        createdBy: params.initialDevelopmentPlan.createdBy,
        evaluation: {
          id: params.initialDevelopmentPlan.evaluationId,
          disciplineId: params.initialDevelopmentPlan.disciplineId,
          disciplineLabel:
            selectedEvaluation?.disciplineLabel ??
            params.initialDevelopmentPlan.disciplineId,
        },
      };
    }

    if (!params.playerId || !selectedEvaluation) {
      throw new Error("playerId and evaluation are required in create mode.");
    }

    return {
      playerId: params.playerId,
      createdBy: params.createdBy,
      evaluation: {
        id: selectedEvaluation.id,
        disciplineId: selectedEvaluation.disciplineId,
        disciplineLabel: selectedEvaluation.disciplineLabel,
      },
    };
  }, [params, selectedEvaluation]);

  const handleSubmit = useCallback(
    async (action: DevelopmentPlanSubmitAction) => {
      setSubmitAction(action);

      const nextErrors = validateDevelopmentPlanForm(values, {
        mode: params.mode,
      });
      setErrors(nextErrors);

      if (hasDevelopmentPlanFormErrors(nextErrors)) {
        return;
      }

      setIsSubmitting(true);

      try {
        const context = buildContext();
        const payload: DevelopmentPlanFormSubmitPayload =
          serializeDevelopmentPlanFormToPayload(values, context);

        let response: Response;
        if (params.mode === "edit" && params.initialDevelopmentPlan) {
          response = await fetch(
            `/api/development-plans/${params.initialDevelopmentPlan.id}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );
        } else {
          response = await fetch("/api/development-plans", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }

        if (!response.ok) {
          const result = (await response.json().catch(() => null)) as
            | { error?: string }
            | null;
          throw new Error(result?.error ?? "Failed to save development plan.");
        }

        const saved = (await response.json()) as { id: string };

        if (action === "save-and-routine") {
          params.onSavedAndContinue?.(saved.id);
        } else {
          params.onSaved?.(saved.id);
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          form:
            error instanceof Error
              ? error.message
              : "Failed to save development plan.",
        }));
      } finally {
        setIsSubmitting(false);
      }
    },
    [buildContext, params, values]
  );

  return {
    mode: params.mode,
    selectedEvaluation,
    values,
    errors,
    isSubmitting,
    submitAction,
    setFieldValue,
    addShortTermGoal,
    updateShortTermGoal,
    removeShortTermGoal,
    addLongTermGoal,
    updateLongTermGoal,
    removeLongTermGoal,
    addFocusArea,
    updateFocusArea,
    removeFocusArea,
    addMeasurableIndicator,
    updateMeasurableIndicator,
    removeMeasurableIndicator,
    handleSubmit,
    resetForm,
  };
}
