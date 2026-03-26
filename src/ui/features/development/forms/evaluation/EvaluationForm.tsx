"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@heroui/react";

import { EvaluationBasicInfoStep } from "./EvaluationBasicInfoStep";
import { EvaluationBucketsStep } from "./EvaluationBucketsStep";
import { EvaluationConstraintsStep } from "./EvaluationConstraintsStep";
import { EvaluationEvidenceStep } from "./EvaluationEvidenceStep";
import { useEvaluationFormContext } from "./EvaluationFormProvider";
import { EvaluationFormStepHeader } from "./EvaluationFormStepHeader";
import { EvaluationSnapshotStep } from "./EvaluationSnapshotStep";
import { EvaluationStrengthProfileStep } from "./EvaluationStrengthProfileStep";

type EvaluationFormProps = {
  onCancel?: () => void;
};

const STANDARD_STEPS = [
  { title: "Basic Info", component: EvaluationBasicInfoStep },
  { title: "Snapshot", component: EvaluationSnapshotStep },
  { title: "Buckets", component: EvaluationBucketsStep },
  { title: "Strength Profile", component: EvaluationStrengthProfileStep },
  { title: "Constraints", component: EvaluationConstraintsStep },
  { title: "Evidence", component: EvaluationEvidenceStep },
] as const;

const TESTS_ONLY_STEPS = [
  { title: "Basic Info", component: EvaluationBasicInfoStep },
  { title: "Evidence", component: EvaluationEvidenceStep },
] as const;

export function EvaluationForm({ onCancel }: EvaluationFormProps) {
  const { mode, values, isSubmitting, handleSubmit, errors } =
    useEvaluationFormContext();
  const [stepIndex, setStepIndex] = useState(0);
  const steps =
    values.evaluationType === "tests_only" ? TESTS_ONLY_STEPS : STANDARD_STEPS;

  useEffect(() => {
    setStepIndex((prev) => Math.min(prev, steps.length - 1));
  }, [steps.length]);

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === steps.length - 1;

  const CurrentStep = useMemo(
    () => steps[stepIndex]?.component ?? EvaluationBasicInfoStep,
    [stepIndex, steps]
  );

  return (
    <div className="flex h-full flex-col">
      <EvaluationFormStepHeader
        stepIndex={stepIndex}
        totalSteps={steps.length}
        title={steps[stepIndex]?.title ?? steps[0].title}
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
