import { useCallback, useMemo, useState } from "react";

import {
  cloneEvaluationFormValues,
  createEmptyBucket,
  createEmptyEvaluationFormValues,
  createEmptyEvidence,
  createEmptyFocusArea,
  createEvaluationFormValuesFromRecord,
} from "./evaluationForm.defaults";
import { serializeEvaluationFormToPayload } from "./evaluationForm.serialization";
import type {
  EvaluationCreateContext,
  EvaluationFormErrorMap,
  EvaluationFormMode,
  EvaluationFormRecord,
  EvaluationFormSubmitPayload,
  EvaluationFormValues,
  EvaluationSubmitAction,
} from "./evaluationForm.types";
import {
  hasEvaluationFormErrors,
  validateEvaluationForm,
} from "./evaluationForm.validation";

type UseEvaluationFormParams = {
  mode: EvaluationFormMode;
  playerId?: string;
  createdBy: string;
  initialEvaluation?: EvaluationFormRecord | null;
  onSaved?: (evaluationId: string) => void;
  onSavedAndContinue?: (evaluationId: string) => void;
};

function getInitialValues(
  params: UseEvaluationFormParams
): EvaluationFormValues {
  if (params.mode === "edit" && params.initialEvaluation) {
    return createEvaluationFormValuesFromRecord(params.initialEvaluation);
  }

  return createEmptyEvaluationFormValues();
}

export function useEvaluationForm(params: UseEvaluationFormParams) {
  const initialValues = useMemo(() => getInitialValues(params), [params]);
  const [values, setValues] = useState<EvaluationFormValues>(initialValues);
  const [errors, setErrors] = useState<EvaluationFormErrorMap>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAction, setSubmitAction] =
    useState<EvaluationSubmitAction | null>(null);

  const resetForm = useCallback(() => {
    setValues(cloneEvaluationFormValues(initialValues));
    setErrors({});
    setSubmitAction(null);
  }, [initialValues]);

  const setFieldValue = useCallback(
    <K extends keyof EvaluationFormValues>(
      key: K,
      value: EvaluationFormValues[K]
    ) => {
      setValues((prev) => {
        if (key === "disciplineId" && prev.disciplineId !== value) {
          return {
            ...prev,
            disciplineId: value as EvaluationFormValues["disciplineId"],
            buckets: params.mode === "create" ? [] : prev.buckets,
          };
        }

        return {
          ...prev,
          [key]: value,
        };
      });
    },
    [params.mode]
  );

  const addStrength = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      strengths: [...prev.strengths, ""],
    }));
  }, []);

  const updateStrength = useCallback((index: number, value: string) => {
    setValues((prev) => {
      const next = [...prev.strengths];
      next[index] = value;
      return { ...prev, strengths: next };
    });
  }, []);

  const removeStrength = useCallback((index: number) => {
    setValues((prev) => ({
      ...prev,
      strengths: prev.strengths.filter((_, i) => i !== index),
    }));
  }, []);

  const addConstraint = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      constraints: [...prev.constraints, ""],
    }));
  }, []);

  const updateConstraint = useCallback((index: number, value: string) => {
    setValues((prev) => {
      const next = [...prev.constraints];
      next[index] = value;
      return { ...prev, constraints: next };
    });
  }, []);

  const removeConstraint = useCallback((index: number) => {
    setValues((prev) => ({
      ...prev,
      constraints: prev.constraints.filter((_, i) => i !== index),
    }));
  }, []);

  const addFocusArea = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      focusAreas: [...prev.focusAreas, createEmptyFocusArea()],
    }));
  }, []);

  const updateFocusArea = useCallback(
    (
      index: number,
      value: Partial<EvaluationFormValues["focusAreas"][number]>
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

  const addBucket = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      buckets: [...prev.buckets, createEmptyBucket()],
    }));
  }, []);

  const updateBucket = useCallback(
    (
      index: number,
      value: Partial<EvaluationFormValues["buckets"][number]>
    ) => {
      setValues((prev) => {
        const next = [...prev.buckets];
        next[index] = { ...next[index], ...value };
        return { ...prev, buckets: next };
      });
    },
    []
  );

  const removeBucket = useCallback((index: number) => {
    setValues((prev) => ({
      ...prev,
      buckets: prev.buckets.filter((_, i) => i !== index),
    }));
  }, []);

  const addEvidence = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      evidence: [...prev.evidence, createEmptyEvidence()],
    }));
  }, []);

  const updateEvidence = useCallback(
    (
      index: number,
      value: Partial<EvaluationFormValues["evidence"][number]>
    ) => {
      setValues((prev) => {
        const next = [...prev.evidence];
        next[index] = { ...next[index], ...value };
        return { ...prev, evidence: next };
      });
    },
    []
  );

  const removeEvidence = useCallback((index: number) => {
    setValues((prev) => ({
      ...prev,
      evidence: prev.evidence.filter((_, i) => i !== index),
    }));
  }, []);

  const buildContext = useCallback((): EvaluationCreateContext => {
    if (params.mode === "edit" && params.initialEvaluation) {
      return {
        playerId: params.initialEvaluation.playerId,
        disciplineId: params.initialEvaluation.disciplineId,
        createdBy: params.initialEvaluation.createdBy,
      };
    }

    if (!params.playerId || !values.disciplineId) {
      throw new Error("playerId and disciplineId are required in create mode.");
    }

    return {
      playerId: params.playerId,
      disciplineId: values.disciplineId,
      createdBy: params.createdBy,
    };
  }, [params, values.disciplineId]);

  const handleSubmit = useCallback(
    async (action: EvaluationSubmitAction) => {
      setSubmitAction(action);

      const nextErrors = validateEvaluationForm(values);
      setErrors(nextErrors);

      if (hasEvaluationFormErrors(nextErrors)) {
        return;
      }

      setIsSubmitting(true);

      try {
        const context = buildContext();
        const payload: EvaluationFormSubmitPayload =
          serializeEvaluationFormToPayload(values, context);

        let savedId: string;

        if (params.mode === "edit" && params.initialEvaluation) {
          const response = await fetch(
            `/api/evaluations/${params.initialEvaluation.id}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          if (!response.ok) {
            const result = (await response.json().catch(() => null)) as
              | { error?: string }
              | null;
            throw new Error(result?.error ?? "Failed to update evaluation.");
          }

          const updated = (await response.json()) as { id: string };
          savedId = updated.id;
        } else {
          const response = await fetch("/api/evaluations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const result = (await response.json().catch(() => null)) as
              | { error?: string }
              | null;
            throw new Error(result?.error ?? "Failed to create evaluation.");
          }

          const created = (await response.json()) as { id: string };
          savedId = created.id;
        }

        if (action === "save-and-plan") {
          params.onSavedAndContinue?.(savedId);
        } else {
          params.onSaved?.(savedId);
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          form:
            error instanceof Error
              ? error.message
              : "Failed to save evaluation.",
        }));
      } finally {
        setIsSubmitting(false);
      }
    },
    [buildContext, params, values]
  );

  return {
    mode: params.mode,
    values,
    errors,
    isSubmitting,
    submitAction,
    setFieldValue,
    addStrength,
    updateStrength,
    removeStrength,
    addConstraint,
    updateConstraint,
    removeConstraint,
    addFocusArea,
    updateFocusArea,
    removeFocusArea,
    addBucket,
    updateBucket,
    removeBucket,
    addEvidence,
    updateEvidence,
    removeEvidence,
    handleSubmit,
    resetForm,
  };
}
