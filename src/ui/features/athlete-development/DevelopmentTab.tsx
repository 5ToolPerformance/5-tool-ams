"use client";

import { useMemo, useState } from "react";

import { Card, CardBody } from "@heroui/react";
import { useRouter } from "next/navigation";

import type { PlayerDevelopmentTabData } from "@/application/players/development/getPlayerDevelopmentTabData";
import { RightSideDrawer } from "@/ui/core/RightSideDrawer";
import { DevelopmentPlanForm } from "@/ui/features/development/forms/development-plan/DevelopmentPlanForm";
import { DevelopmentPlanFormProvider } from "@/ui/features/development/forms/development-plan/DevelopmentPlanFormProvider";
import type { DevelopmentPlanEvaluationOption } from "@/ui/features/development/forms/development-plan/developmentPlanForm.types";
import { EvaluationForm } from "@/ui/features/development/forms/evaluation/EvaluationForm";
import { EvaluationFormProvider } from "@/ui/features/development/forms/evaluation/EvaluationFormProvider";
import type {
  EvaluationBucketOption,
  EvaluationDisciplineOption,
} from "@/ui/features/development/forms/evaluation/evaluationForm.types";

import { ActivePlanPanel } from "./ActivePlanPanel";
import { CurrentSnapshotPanel } from "./CurrentSnapshotPanel";
import { DevelopmentActionButtons } from "./DevelopmentActionButtons";
import { DevelopmentDisciplineSelector } from "./DevelopmentDisciplineSelector";
import { DevelopmentHistoryPanel } from "./DevelopmentHistoryPanel";
import { RoutinesPanel } from "./RoutinesPanel";

interface DevelopmentTabProps {
  playerId: string;
  createdBy: string;
  data: PlayerDevelopmentTabData;
  evaluationDisciplineOptions: EvaluationDisciplineOption[];
  evaluationBucketOptions: EvaluationBucketOption[];
}

type DevelopmentDrawerAction = "evaluation" | "plan" | "routine" | null;

function formatEvaluationSummary(
  summary: string | null | undefined,
  fallback = "No summary provided."
) {
  const trimmed = summary?.trim();
  return trimmed ? trimmed : fallback;
}

export function DevelopmentTab({
  playerId,
  createdBy,
  data,
  evaluationDisciplineOptions,
  evaluationBucketOptions,
}: DevelopmentTabProps) {
  const router = useRouter();
  const [activeAction, setActiveAction] =
    useState<DevelopmentDrawerAction>(null);
  const [initialPlanEvaluationId, setInitialPlanEvaluationId] = useState("");
  const [isPlanEvaluationLocked, setIsPlanEvaluationLocked] = useState(false);

  const selectedDiscipline = data.selectedDiscipline;

  const evaluationOptions = useMemo<DevelopmentPlanEvaluationOption[]>(() => {
    const rows = [
      ...(data.latestEvaluation ? [data.latestEvaluation] : []),
      ...data.evaluationHistory,
    ];

    return rows.map((evaluation) => ({
      id: evaluation.id,
      disciplineId: evaluation.disciplineId,
      disciplineLabel: selectedDiscipline?.label ?? "Selected Discipline",
      evaluationDate: evaluation.evaluationDate,
      evaluationType: evaluation.evaluationType,
      phase: evaluation.phase,
      summary: formatEvaluationSummary(evaluation.snapshotSummary),
    }));
  }, [data.evaluationHistory, data.latestEvaluation, selectedDiscipline?.label]);

  const canCreatePlan = evaluationOptions.length > 0;

  const closeDrawer = () => {
    setActiveAction(null);
    setInitialPlanEvaluationId("");
    setIsPlanEvaluationLocked(false);
  };

  const openEvaluationDrawer = () => {
    setActiveAction("evaluation");
    setInitialPlanEvaluationId("");
    setIsPlanEvaluationLocked(false);
  };

  const openPlanDrawer = (
    evaluationId = data.latestEvaluation?.id ?? "",
    isLocked = false
  ) => {
    if (!evaluationId && !canCreatePlan) {
      return;
    }

    setInitialPlanEvaluationId(evaluationId);
    setIsPlanEvaluationLocked(isLocked);
    setActiveAction("plan");
  };

  const openRoutineDrawer = () => {
    setActiveAction("routine");
  };

  const drawerTitle =
    activeAction === "evaluation"
      ? "New Evaluation"
      : activeAction === "plan"
      ? "New Development Plan"
      : activeAction === "routine"
      ? "New Routine"
      : "";

  if (!data.flags.hasAnyDisciplineData || !selectedDiscipline) {
    return (
      <>
        <Card shadow="sm">
          <CardBody className="space-y-3">
            <h2 className="text-lg font-semibold">Development</h2>
            <p className="text-sm text-muted-foreground">
              No development data exists yet for this athlete. Add an
              evaluation to begin the development workflow.
            </p>
            <DevelopmentActionButtons
              canCreatePlan={false}
              onOpenEvaluation={openEvaluationDrawer}
              onOpenPlan={() => openPlanDrawer()}
              onOpenRoutine={openRoutineDrawer}
            />
          </CardBody>
        </Card>
        <RightSideDrawer
          isOpen={activeAction !== null}
          onClose={closeDrawer}
          title={drawerTitle}
        >
          {activeAction === "evaluation" ? (
            <div className="-mx-6 -my-5 h-full">
              <EvaluationFormProvider
                mode="create"
                playerId={playerId}
                createdBy={createdBy}
                disciplineOptions={evaluationDisciplineOptions}
                bucketOptions={evaluationBucketOptions}
                onSaved={() => {
                  closeDrawer();
                  router.refresh();
                }}
                onSavedAndContinue={(evaluationId) => {
                  openPlanDrawer(evaluationId, true);
                }}
              >
                <EvaluationForm onCancel={closeDrawer} />
              </EvaluationFormProvider>
            </div>
          ) : activeAction === "routine" ? (
            <div
              aria-label="New Routine content"
              className="min-h-[16rem] rounded-xl border border-dashed border-default-300 bg-default-50 p-6"
            />
          ) : null}
        </RightSideDrawer>
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <Card shadow="sm">
          <CardBody className="space-y-3">
            <div>
              <h1 className="text-xl font-semibold">Development</h1>
              <p className="text-sm text-muted-foreground">
                Evaluation, development plan, and routine context for coaches.
              </p>
            </div>
            <DevelopmentDisciplineSelector
              selectedDisciplineId={selectedDiscipline.id}
              disciplines={data.disciplineOptions}
            />
            <DevelopmentActionButtons
              canCreatePlan={canCreatePlan}
              onOpenEvaluation={openEvaluationDrawer}
              onOpenPlan={() => openPlanDrawer()}
              onOpenRoutine={openRoutineDrawer}
            />
          </CardBody>
        </Card>

        <CurrentSnapshotPanel
          latestEvaluation={data.latestEvaluation}
          disciplineKey={selectedDiscipline.key}
          onOpenEvaluation={openEvaluationDrawer}
          onOpenPlan={() => openPlanDrawer()}
          onOpenRoutine={openRoutineDrawer}
          canCreatePlan={canCreatePlan}
        />

        <ActivePlanPanel
          activePlan={data.activePlan}
          latestEvaluation={data.latestEvaluation}
          disciplineKey={selectedDiscipline.key}
          onCreatePlanFromLatestEvaluation={() =>
            openPlanDrawer(data.latestEvaluation?.id ?? "")
          }
          onOpenEvaluation={openEvaluationDrawer}
          onOpenRoutine={openRoutineDrawer}
        />

        <RoutinesPanel
          playerRoutines={data.playerRoutines}
          universalRoutinesSupported={data.universalRoutinesSupported}
          disciplineKey={selectedDiscipline.key}
          onOpenRoutine={openRoutineDrawer}
        />

        <DevelopmentHistoryPanel
          evaluationHistory={data.evaluationHistory}
          developmentPlanHistory={data.developmentPlanHistory}
          disciplineKey={selectedDiscipline.key}
          onCreatePlanFromEvaluation={(evaluationId) =>
            openPlanDrawer(evaluationId)
          }
        />
      </div>

      <RightSideDrawer
        isOpen={activeAction !== null}
        onClose={closeDrawer}
        title={drawerTitle}
      >
        {activeAction === "evaluation" ? (
          <div className="-mx-6 -my-5 h-full">
            <EvaluationFormProvider
              mode="create"
              playerId={playerId}
              createdBy={createdBy}
              disciplineOptions={evaluationDisciplineOptions}
              bucketOptions={evaluationBucketOptions}
              onSaved={() => {
                closeDrawer();
                router.refresh();
              }}
              onSavedAndContinue={(evaluationId) => {
                openPlanDrawer(evaluationId, true);
              }}
            >
              <EvaluationForm onCancel={closeDrawer} />
            </EvaluationFormProvider>
          </div>
        ) : activeAction === "plan" ? (
          <div className="-mx-6 -my-5 h-full">
            <DevelopmentPlanFormProvider
              mode="create"
              playerId={playerId}
              createdBy={createdBy}
              evaluationOptions={evaluationOptions}
              initialEvaluationId={initialPlanEvaluationId}
              isEvaluationSelectionLocked={isPlanEvaluationLocked}
              onSaved={() => {
                closeDrawer();
                router.refresh();
              }}
              onSavedAndContinue={() => {
                closeDrawer();
                router.refresh();
              }}
            >
              <DevelopmentPlanForm onCancel={closeDrawer} />
            </DevelopmentPlanFormProvider>
          </div>
        ) : activeAction === "routine" ? (
          <div
            aria-label="New Routine content"
            className="min-h-[16rem] rounded-xl border border-dashed border-default-300 bg-default-50 p-6"
          />
        ) : null}
      </RightSideDrawer>
    </>
  );
}
