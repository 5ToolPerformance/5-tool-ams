"use client";

import { Button } from "@heroui/react";

type DevelopmentAction = "evaluation" | "plan" | "routine";

const ACTION_LABELS: Record<DevelopmentAction, string> = {
  evaluation: "New Evaluation",
  plan: "New Development Plan",
  routine: "New Routine",
};

interface DevelopmentActionButtonsProps {
  primaryAction?: DevelopmentAction;
  canCreatePlan: boolean;
  canCreateRoutine: boolean;
  onOpenEvaluation: () => void;
  onOpenPlan: () => void;
  onOpenRoutine: () => void;
}

export function DevelopmentActionButtons({
  primaryAction = "evaluation",
  canCreatePlan,
  canCreateRoutine,
  onOpenEvaluation,
  onOpenPlan,
  onOpenRoutine,
}: DevelopmentActionButtonsProps) {
  return (
    <div
      aria-label="Development tab actions"
      className="flex flex-wrap gap-2"
      role="group"
    >
      <Button
        size="sm"
        color={primaryAction === "evaluation" ? "primary" : "default"}
        disableRipple
        variant={primaryAction === "evaluation" ? "solid" : "flat"}
        onPress={onOpenEvaluation}
      >
        {ACTION_LABELS.evaluation}
      </Button>
      <Button
        size="sm"
        color={primaryAction === "plan" ? "primary" : "default"}
        disableRipple
        variant={primaryAction === "plan" ? "solid" : "flat"}
        onPress={onOpenPlan}
        isDisabled={!canCreatePlan}
      >
        {ACTION_LABELS.plan}
      </Button>
      <Button
        size="sm"
        color={primaryAction === "routine" ? "primary" : "default"}
        disableRipple
        variant={primaryAction === "routine" ? "solid" : "flat"}
        onPress={onOpenRoutine}
        isDisabled={!canCreateRoutine}
      >
        {ACTION_LABELS.routine}
      </Button>
    </div>
  );
}
