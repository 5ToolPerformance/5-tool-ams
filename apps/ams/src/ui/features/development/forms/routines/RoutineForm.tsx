"use client";

import { useMemo, useState } from "react";

import { Button } from "@heroui/react";

import { RoutineBasicInfoStep } from "./RoutineBasicInfoStep";
import { RoutineBlocksStep } from "./RoutineBlocksStep";
import { useRoutineFormContext } from "./RoutineFormProvider";
import { RoutineFormStepHeader } from "./RoutineFormStepHeader";
import { RoutineMechanicsStep } from "./RoutineMechanicsStep";
import { RoutineOverviewStep } from "./RoutineOverviewStep";

type RoutineFormProps = {
  onCancel?: () => void;
};

const STEP_TITLES = [
  "Basic Info",
  "Overview",
  "Mechanics",
  "Blocks & Drills",
] as const;

export function RoutineForm({ onCancel }: RoutineFormProps) {
  const { mode, isSubmitting, handleSubmit, errors } = useRoutineFormContext();
  const [stepIndex, setStepIndex] = useState(0);

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === STEP_TITLES.length - 1;

  const CurrentStep = useMemo(() => {
    switch (stepIndex) {
      case 0:
        return RoutineBasicInfoStep;
      case 1:
        return RoutineOverviewStep;
      case 2:
        return RoutineMechanicsStep;
      case 3:
        return RoutineBlocksStep;
      default:
        return RoutineBasicInfoStep;
    }
  }, [stepIndex]);

  return (
    <div aria-label="routine-form" className="flex h-full flex-col">
      <RoutineFormStepHeader
        stepIndex={stepIndex}
        totalSteps={STEP_TITLES.length}
        title={STEP_TITLES[stepIndex]}
        mode={mode}
      />

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <CurrentStep />
      </div>

      <div className="border-t bg-background px-6 py-4">
        {errors.form ? (
          <p className="mb-3 text-sm text-danger">{errors.form}</p>
        ) : null}
        <div className="flex items-center justify-between gap-3">
          <div>
            {!isFirstStep ? (
              <Button
                variant="bordered"
                onPress={() => setStepIndex((prev) => prev - 1)}
                isDisabled={isSubmitting}
              >
                Back
              </Button>
            ) : (
              <Button
                variant="bordered"
                onPress={onCancel}
                isDisabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isLastStep ? (
              <Button
                color="primary"
                onPress={() => setStepIndex((prev) => prev + 1)}
                isDisabled={isSubmitting}
              >
                Next
              </Button>
            ) : (
              <Button
                color="primary"
                onPress={() => handleSubmit("save")}
                isLoading={isSubmitting}
              >
                {mode === "edit" ? "Save Changes" : "Save Routine"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
