"use client";

import { createContext, useContext, useMemo } from "react";

import type {
  DevelopmentPlanFormContextValue,
  DevelopmentPlanFormProviderProps,
} from "./developmentPlanForm.types";
import { useDevelopmentPlanForm } from "./useDevelopmentPlanForm";

const DevelopmentPlanFormContext =
  createContext<DevelopmentPlanFormContextValue | null>(null);

export function DevelopmentPlanFormProvider({
  mode,
  playerId,
  createdBy,
  evaluationOptions = [],
  initialEvaluationId,
  isEvaluationSelectionLocked = false,
  initialDevelopmentPlan,
  onSaved,
  onSavedAndContinue,
  children,
}: DevelopmentPlanFormProviderProps) {
  const form = useDevelopmentPlanForm({
    mode,
    playerId,
    createdBy,
    evaluationOptions,
    initialEvaluationId,
    initialDevelopmentPlan,
    onSaved,
    onSavedAndContinue,
  });

  const value = useMemo<DevelopmentPlanFormContextValue>(
    () => ({
      mode: form.mode,
      evaluationOptions,
      selectedEvaluation: form.selectedEvaluation,
      isEvaluationSelectionLocked,
      values: form.values,
      errors: form.errors,
      isSubmitting: form.isSubmitting,
      submitAction: form.submitAction,
      setFieldValue: form.setFieldValue,
      addShortTermGoal: form.addShortTermGoal,
      updateShortTermGoal: form.updateShortTermGoal,
      removeShortTermGoal: form.removeShortTermGoal,
      addLongTermGoal: form.addLongTermGoal,
      updateLongTermGoal: form.updateLongTermGoal,
      removeLongTermGoal: form.removeLongTermGoal,
      addFocusArea: form.addFocusArea,
      updateFocusArea: form.updateFocusArea,
      removeFocusArea: form.removeFocusArea,
      addMeasurableIndicator: form.addMeasurableIndicator,
      updateMeasurableIndicator: form.updateMeasurableIndicator,
      removeMeasurableIndicator: form.removeMeasurableIndicator,
      handleSubmit: form.handleSubmit,
      resetForm: form.resetForm,
    }),
    [evaluationOptions, form, isEvaluationSelectionLocked]
  );

  return (
    <DevelopmentPlanFormContext.Provider value={value}>
      {children}
    </DevelopmentPlanFormContext.Provider>
  );
}

export function useDevelopmentPlanFormContext() {
  const context = useContext(DevelopmentPlanFormContext);

  if (!context) {
    throw new Error(
      "useDevelopmentPlanFormContext must be used within a DevelopmentPlanFormProvider."
    );
  }

  return context;
}
