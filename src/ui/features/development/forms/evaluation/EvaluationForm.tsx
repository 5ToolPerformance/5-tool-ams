"use client";

import { useMemo, useState } from "react";

import { Button } from "@heroui/react";

import { EvaluationBasicInfoStep } from "./EvaluationBasicInfoStep";
import { EvaluationBucketsStep } from "./EvaluationBucketsStep";
import { EvaluationConstraintsStep } from "./EvaluationConstraintsStep";
import { EvaluationEvidenceStep } from "./EvaluationEvidenceStep";
import { EvaluationFocusAreasStep } from "./EvaluationFocusAreasStep";
import { useEvaluationFormContext } from "./EvaluationFormProvider";
import { EvaluationFormStepHeader } from "./EvaluationFormStepHeader";
import { EvaluationSnapshotStep } from "./EvaluationSnapshotStep";
import { EvaluationStrengthProfileStep } from "./EvaluationStrengthProfileStep";

type EvaluationFormProps = {
  onCancel?: () => void;
};

const STEP_TITLES = [
  "Basic Info",
  "Snapshot",
  "Strength Profile",
  "Constraints",
  "Focus Areas",
  "Buckets",
  "Evidence",
] as const;

export function EvaluationForm({ onCancel }: EvaluationFormProps) {
  const { mode, isSubmitting, handleSubmit } = useEvaluationFormContext();
  const [stepIndex, setStepIndex] = useState(0);

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === STEP_TITLES.length - 1;

  const CurrentStep = useMemo(() => {
    switch (stepIndex) {
      case 0:
        return EvaluationBasicInfoStep;
      case 1:
        return EvaluationSnapshotStep;
      case 2:
        return EvaluationStrengthProfileStep;
      case 3:
        return EvaluationConstraintsStep;
      case 4:
        return EvaluationFocusAreasStep;
      case 5:
        return EvaluationBucketsStep;
      case 6:
        return EvaluationEvidenceStep;
      default:
        return EvaluationBasicInfoStep;
    }
  }, [stepIndex]);

  return (
    <div className="flex h-full flex-col">
      <EvaluationFormStepHeader
        stepIndex={stepIndex}
        totalSteps={STEP_TITLES.length}
        title={STEP_TITLES[stepIndex]}
        mode={mode}
      />

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <CurrentStep />
      </div>

      <div className="border-t bg-background px-6 py-4">
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
                  {mode === "edit" ? "Save Changes" : "Save Evaluation"}
                </Button>

                {mode === "create" ? (
                  <Button
                    color="primary"
                    onPress={() => handleSubmit("save-and-plan")}
                    isLoading={isSubmitting}
                  >
                    Save and Create Plan
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
