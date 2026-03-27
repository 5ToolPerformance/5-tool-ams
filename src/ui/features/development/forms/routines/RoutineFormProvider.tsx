"use client";

import { createContext, useContext, useMemo } from "react";

import type {
  RoutineFormContextValue,
  RoutineFormProviderProps,
} from "./routineForm.types";
import { useRoutineForm } from "./useRoutineForm";

const RoutineFormContext = createContext<RoutineFormContextValue | null>(null);

export function RoutineFormProvider({
  mode,
  contextType = "development-plan",
  createdBy,
  developmentPlanOptions = [],
  disciplineOptions = [],
  mechanicOptions = [],
  drillOptions = [],
  initialDevelopmentPlanId,
  initialDisciplineId,
  isDevelopmentPlanSelectionLocked = false,
  initialRoutine,
  onSaved,
  children,
}: RoutineFormProviderProps) {
  const form = useRoutineForm({
    mode,
    contextType,
    createdBy,
    developmentPlanOptions,
    disciplineOptions,
    mechanicOptions,
    drillOptions,
    initialDevelopmentPlanId,
    initialDisciplineId,
    initialRoutine,
    onSaved,
  });

  const value = useMemo<RoutineFormContextValue>(
    () => ({
      mode: form.mode,
      contextType: form.contextType,
      developmentPlanOptions,
      disciplineOptions,
      selectedDevelopmentPlan: form.selectedDevelopmentPlan,
      selectedDiscipline: form.selectedDiscipline,
      isDevelopmentPlanSelectionLocked,
      mechanicOptions,
      drillOptions,
      availableMechanicOptions: form.availableMechanicOptions,
      availableDrillOptions: form.availableDrillOptions,
      values: form.values,
      errors: form.errors,
      isSubmitting: form.isSubmitting,
      submitAction: form.submitAction,
      setFieldValue: form.setFieldValue,
      addMechanic: form.addMechanic,
      updateMechanic: form.updateMechanic,
      removeMechanic: form.removeMechanic,
      addBlock: form.addBlock,
      updateBlock: form.updateBlock,
      removeBlock: form.removeBlock,
      addDrillToBlock: form.addDrillToBlock,
      updateDrillInBlock: form.updateDrillInBlock,
      removeDrillFromBlock: form.removeDrillFromBlock,
      handleSubmit: form.handleSubmit,
      resetForm: form.resetForm,
    }),
    [
      developmentPlanOptions,
      disciplineOptions,
      drillOptions,
      form,
      isDevelopmentPlanSelectionLocked,
      mechanicOptions,
    ]
  );

  return (
    <RoutineFormContext.Provider value={value}>
      {children}
    </RoutineFormContext.Provider>
  );
}

export function useRoutineFormContext() {
  const context = useContext(RoutineFormContext);

  if (!context) {
    throw new Error(
      "useRoutineFormContext must be used within a RoutineFormProvider."
    );
  }

  return context;
}
