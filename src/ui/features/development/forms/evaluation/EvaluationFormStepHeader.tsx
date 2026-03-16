"use client";

import { Chip, Progress } from "@heroui/react";

type EvaluationFormStepHeaderProps = {
  stepIndex: number;
  totalSteps: number;
  title: string;
  mode: "create" | "edit";
};

export function EvaluationFormStepHeader({
  stepIndex,
  totalSteps,
  title,
  mode,
}: EvaluationFormStepHeaderProps) {
  const progressValue = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <div className="border-b px-6 py-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            {mode === "edit" ? "Edit Evaluation" : "New Evaluation"}
          </h2>
          <p className="text-sm text-default-500">
            Step {stepIndex + 1} of {totalSteps}: {title}
          </p>
        </div>

        <Chip size="sm" variant="flat">
          {title}
        </Chip>
      </div>

      <Progress
        aria-label="Evaluation form progress"
        value={progressValue}
        className="max-w-full"
      />
    </div>
  );
}
