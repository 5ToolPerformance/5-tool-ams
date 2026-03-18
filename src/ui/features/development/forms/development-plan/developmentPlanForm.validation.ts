import type {
  DevelopmentPlanFormErrorMap,
  DevelopmentPlanFormValues,
} from "./developmentPlanForm.types";

export function validateDevelopmentPlanForm(
  values: DevelopmentPlanFormValues,
  options: {
    mode: "create" | "edit";
  }
): DevelopmentPlanFormErrorMap {
  const errors: DevelopmentPlanFormErrorMap = {};

  if (options.mode === "create" && !values.evaluationId) {
    errors.evaluationId = "Evaluation is required.";
  }

  if (!values.status) {
    errors.status = "Status is required.";
  }

  if (values.status === "active" && !values.currentPriority.trim()) {
    errors.currentPriority =
      "Current priority is recommended when a plan is active.";
  }

  values.shortTermGoals.forEach((item, index) => {
    if (!item.title.trim()) {
      errors[`shortTermGoals.${index}.title`] =
        "Short-term goal title is required.";
    }
  });

  values.longTermGoals.forEach((item, index) => {
    if (!item.title.trim()) {
      errors[`longTermGoals.${index}.title`] =
        "Long-term goal title is required.";
    }
  });

  values.focusAreas.forEach((item, index) => {
    if (!item.title.trim()) {
      errors[`focusAreas.${index}.title`] = "Focus area title is required.";
    }
  });

  values.measurableIndicators.forEach((item, index) => {
    if (!item.title.trim()) {
      errors[`measurableIndicators.${index}.title`] =
        "Indicator title is required.";
    }
  });

  return errors;
}

export function hasDevelopmentPlanFormErrors(
  errors: DevelopmentPlanFormErrorMap
): boolean {
  return Object.keys(errors).length > 0;
}
