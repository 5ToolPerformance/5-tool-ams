import type {
  RoutineFormErrorMap,
  RoutineFormValues,
} from "./routineForm.types";

export function validateRoutineForm(
  values: RoutineFormValues,
  options: { mode: "create" | "edit" }
): RoutineFormErrorMap {
  const errors: RoutineFormErrorMap = {};

  if (options.mode === "create" && !values.developmentPlanId) {
    errors.developmentPlanId = "Development plan is required.";
  }

  if (!values.title.trim()) {
    errors.title = "Routine title is required.";
  }

  if (!values.routineType) {
    errors.routineType = "Routine type is required.";
  }

  if (values.mechanics.length === 0) {
    errors.mechanics = "At least one mechanic is required.";
  }

  values.mechanics.forEach((item, index) => {
    if (!item.mechanicId.trim()) {
      errors[`mechanics.${index}.mechanicId`] = "Mechanic is required.";
    }
  });

  if (values.blocks.length === 0) {
    errors.blocks = "At least one block is required.";
  }

  values.blocks.forEach((block, blockIndex) => {
    if (!block.title.trim()) {
      errors[`blocks.${blockIndex}.title`] = "Block title is required.";
    }

    if (block.drills.length === 0) {
      errors[`blocks.${blockIndex}.drills`] =
        "Each block must contain at least one drill.";
    }

    block.drills.forEach((drill, drillIndex) => {
      if (!drill.drillId.trim()) {
        errors[`blocks.${blockIndex}.drills.${drillIndex}.drillId`] =
          "Drill is required.";
      }
    });
  });

  return errors;
}

export function hasRoutineFormErrors(errors: RoutineFormErrorMap): boolean {
  return Object.keys(errors).length > 0;
}
