"use client";

import { useMemo, useState } from "react";

import { Button } from "@heroui/react";

import { DevelopmentPlanBasicInfoStep } from "./DevelopmentPlanBasicInfoStep";
import { DevelopmentPlanFocusAreasStep } from "./DevelopmentPlanFocusAreasStep";
import { useDevelopmentPlanFormContext } from "./DevelopmentPlanFormProvider";
import { DevelopmentPlanFormStepHeader } from "./DevelopmentPlanFormStepHeader";
import { DevelopmentPlanLongTermGoalsStep } from "./DevelopmentPlanLongTermGoalsStep";
import { DevelopmentPlanMeasurableIndicatorsStep } from "./DevelopmentPlanMeasurableIndicatorsStep";
import { DevelopmentPlanOverviewStep } from "./DevelopmentPlanOverviewStep";
import { DevelopmentPlanShortTermGoalsStep } from "./DevelopmentPlanShortTermGoalsStep";

type DevelopmentPlanFormProps = {
  onCancel?: () => void;
};

const STEP_TITLES = [
  "Basic Info",
  "Overview",
  "Short-Term Goals",
  "Long-Term Goals",
  "Focus Areas",
  "Measurable Indicators",
] as const;

export function DevelopmentPlanForm({ onCancel }: DevelopmentPlanFormProps) {
  const { mode, isSubmitting, handleSubmit, errors } =
    useDevelopmentPlanFormContext();
  const [stepIndex, setStepIndex] = useState(0);

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === STEP_TITLES.length - 1;

  const CurrentStep = useMemo(() => {
    switch (stepIndex) {
      case 0:
        return DevelopmentPlanBasicInfoStep;
      case 1:
        return DevelopmentPlanOverviewStep;
      case 2:
        return DevelopmentPlanShortTermGoalsStep;
      case 3:
        return DevelopmentPlanLongTermGoalsStep;
      case 4:
        return DevelopmentPlanFocusAreasStep;
      case 5:
        return DevelopmentPlanMeasurableIndicatorsStep;
      default:
        return DevelopmentPlanBasicInfoStep;
    }
  }, [stepIndex]);

  return (
    <div aria-label="development-plan-form" className="flex h-full flex-col">
      <DevelopmentPlanFormStepHeader
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
              <>
                <Button
                  variant="bordered"
                  onPress={() => handleSubmit("save")}
                  isLoading={isSubmitting}
                >
                  {mode === "edit" ? "Save Changes" : "Save Development Plan"}
                </Button>

                {mode === "create" ? (
                  <Button
                    color="primary"
                    onPress={() => handleSubmit("save-and-routine")}
                    isLoading={isSubmitting}
                  >
                    Save and Add Routine
                  </Button>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
