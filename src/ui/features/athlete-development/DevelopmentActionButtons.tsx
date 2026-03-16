"use client";

import { useState } from "react";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

import { EvaluationForm } from "@/ui/features/development/forms/evaluation/EvaluationForm";
import { EvaluationFormProvider } from "@/ui/features/development/forms/evaluation/EvaluationFormProvider";
import type { EvaluationDisciplineOption } from "@/ui/features/development/forms/evaluation/evaluationForm.types";
import { RightSideDrawer } from "@/ui/core/RightSideDrawer";

type DevelopmentAction = "evaluation" | "plan" | "routine";

const ACTION_LABELS: Record<DevelopmentAction, string> = {
  evaluation: "New Evaluation",
  plan: "New Development Plan",
  routine: "New Routine",
};

interface DevelopmentActionButtonsProps {
  playerId: string;
  createdBy: string;
  disciplineOptions: EvaluationDisciplineOption[];
  primaryAction?: DevelopmentAction;
}

export function DevelopmentActionButtons({
  playerId,
  createdBy,
  disciplineOptions,
  primaryAction = "evaluation",
}: DevelopmentActionButtonsProps) {
  const router = useRouter();
  const [activeAction, setActiveAction] = useState<DevelopmentAction | null>(
    null
  );

  const drawerTitle = activeAction ? ACTION_LABELS[activeAction] : "";

  return (
    <>
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
          onPress={() => setActiveAction("evaluation")}
        >
          {ACTION_LABELS.evaluation}
        </Button>
        <Button
          size="sm"
          color={primaryAction === "plan" ? "primary" : "default"}
          disableRipple
          variant={primaryAction === "plan" ? "solid" : "flat"}
          onPress={() => setActiveAction("plan")}
        >
          {ACTION_LABELS.plan}
        </Button>
        <Button
          size="sm"
          color={primaryAction === "routine" ? "primary" : "default"}
          disableRipple
          variant={primaryAction === "routine" ? "solid" : "flat"}
          onPress={() => setActiveAction("routine")}
        >
          {ACTION_LABELS.routine}
        </Button>
      </div>

      <RightSideDrawer
        isOpen={activeAction !== null}
        onClose={() => setActiveAction(null)}
        title={drawerTitle}
      >
        {activeAction === "evaluation" ? (
          <div className="-mx-6 -my-5 h-full">
            <EvaluationFormProvider
              mode="create"
              playerId={playerId}
              createdBy={createdBy}
              disciplineOptions={disciplineOptions}
              onSaved={() => {
                setActiveAction(null);
                router.refresh();
              }}
              onSavedAndContinue={() => {
                setActiveAction(null);
                router.refresh();
              }}
            >
              <EvaluationForm onCancel={() => setActiveAction(null)} />
            </EvaluationFormProvider>
          </div>
        ) : (
          <div
            aria-label={`${drawerTitle} content`}
            className="min-h-[16rem] rounded-xl border border-dashed border-default-300 bg-default-50 p-6"
          />
        )}
      </RightSideDrawer>
    </>
  );
}
