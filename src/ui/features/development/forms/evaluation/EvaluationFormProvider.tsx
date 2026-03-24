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

function sortBucketOptions<
  T extends { label: string; sortOrder: number | null }
>(options: T[]) {
  return [...options].sort((a, b) => {
    const sortOrderA = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
    const sortOrderB = b.sortOrder ?? Number.MAX_SAFE_INTEGER;

    if (sortOrderA !== sortOrderB) {
      return sortOrderA - sortOrderB;
    }

    return a.label.localeCompare(b.label);
  });
}

export function EvaluationFormProvider({
  mode,
  playerId,
  createdBy,
  disciplineOptions,
  bucketOptions,
  initialEvaluation,
  onSaved,
  onSavedAndContinue,
  children,
}: EvaluationFormProviderProps) {
  const form = useEvaluationForm({
    mode,
    playerId,
    createdBy,
    disciplineOptions,
    bucketOptions,
    initialEvaluation,
    onSaved,
    onSavedAndContinue,
  });

  const value = useMemo<EvaluationFormContextValue>(
    () => ({
      mode: form.mode,
      disciplineOptions,
      selectedDiscipline:
        disciplineOptions.find((option) => option.id === form.values.disciplineId) ??
        null,
      bucketOptions: sortBucketOptions(bucketOptions),
      availableBucketOptions: sortBucketOptions(
        bucketOptions.filter(
          (bucket) => bucket.disciplineId === form.values.disciplineId
        )
      ),
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
    [bucketOptions, disciplineOptions, form]
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
