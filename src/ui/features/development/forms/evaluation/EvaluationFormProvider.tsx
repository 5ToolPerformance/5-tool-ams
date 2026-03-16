"use client";

import { createContext, useContext, useMemo } from "react";

import type {
  EvaluationFormContextValue,
  EvaluationFormProviderProps,
} from "./evaluationForm.types";
import { useEvaluationForm } from "./useEvaluationForm";

const EvaluationFormContext = createContext<EvaluationFormContextValue | null>(
  null
);

export function EvaluationFormProvider({
  mode,
  playerId,
  disciplineId,
  createdBy,
  initialEvaluation,
  children,
}: EvaluationFormProviderProps) {
  const form = useEvaluationForm({
    mode,
    playerId,
    disciplineId,
    createdBy,
    initialEvaluation,
  });

  const value = useMemo<EvaluationFormContextValue>(
    () => ({
      mode: form.mode,
      values: form.values,
      errors: form.errors,
      isSubmitting: form.isSubmitting,
      submitAction: form.submitAction,
      setFieldValue: form.setFieldValue,
      addStrength: form.addStrength,
      updateStrength: form.updateStrength,
      removeStrength: form.removeStrength,
      addConstraint: form.addConstraint,
      updateConstraint: form.updateConstraint,
      removeConstraint: form.removeConstraint,
      addFocusArea: form.addFocusArea,
      updateFocusArea: form.updateFocusArea,
      removeFocusArea: form.removeFocusArea,
      addBucket: form.addBucket,
      updateBucket: form.updateBucket,
      removeBucket: form.removeBucket,
      addEvidence: form.addEvidence,
      updateEvidence: form.updateEvidence,
      removeEvidence: form.removeEvidence,
      handleSubmit: form.handleSubmit,
      resetForm: form.resetForm,
    }),
    [form]
  );

  return (
    <EvaluationFormContext.Provider value={value}>
      {children}
    </EvaluationFormContext.Provider>
  );
}

export function useEvaluationFormContext() {
  const context = useContext(EvaluationFormContext);

  if (!context) {
    throw new Error(
      "useEvaluationFormContext must be used within an EvaluationFormProvider."
    );
  }

  return context;
}
