"use client";

import { useMemo, useState } from "react";

import { Button, Card, CardBody } from "@heroui/react";
import { useRouter } from "next/navigation";

import type { PlayerDevelopmentTabData } from "@/application/players/development/getPlayerDevelopmentTabData";
import type { RoutineFormConfig } from "@/application/routines/getRoutineFormConfig";
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
import { RoutineForm } from "@/ui/features/development/forms/routines/RoutineForm";
import { RoutineFormProvider } from "@/ui/features/development/forms/routines/RoutineFormProvider";
import { buildDevelopmentReportPdfPath } from "@/lib/reports/developmentReportQuery";

import { ActivePlanPanel } from "./ActivePlanPanel";
import { CurrentSnapshotPanel } from "./CurrentSnapshotPanel";
import { DevelopmentActionButtons } from "./DevelopmentActionButtons";
import { DevelopmentDocumentModal } from "./DevelopmentDocumentModal";
import { DevelopmentDisciplineSelector } from "./DevelopmentDisciplineSelector";
import { DevelopmentHistoryPanel } from "./DevelopmentHistoryPanel";
import { DevelopmentReportOptionsModal } from "./DevelopmentReportOptionsModal";
import { RoutinesPanel } from "./RoutinesPanel";

interface DevelopmentTabProps {
  playerId: string;
  createdBy: string;
  data: PlayerDevelopmentTabData;
  evaluationDisciplineOptions: EvaluationDisciplineOption[];
  evaluationBucketOptions: EvaluationBucketOption[];
  routineFormConfig: RoutineFormConfig;
}

type DevelopmentDrawerAction = "evaluation" | "plan" | "routine" | null;
type DevelopmentDocumentViewState =
  | { id: string; type: "evaluation" | "development-plan" }
  | null;

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
  routineFormConfig,
}: DevelopmentTabProps) {
  const router = useRouter();
  const [activeAction, setActiveAction] =
    useState<DevelopmentDrawerAction>(null);
  const [initialPlanEvaluationId, setInitialPlanEvaluationId] = useState("");
  const [isPlanEvaluationLocked, setIsPlanEvaluationLocked] = useState(false);
  const [initialRoutineDevelopmentPlanId, setInitialRoutineDevelopmentPlanId] =
    useState("");
  const [isRoutinePlanLocked, setIsRoutinePlanLocked] = useState(false);
  const [isReportOptionsOpen, setIsReportOptionsOpen] = useState(false);
  const [viewDocument, setViewDocument] =
    useState<DevelopmentDocumentViewState>(null);

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

  const developmentPlanOptions = useMemo(() => {
    if (!data.activePlan) {
      return routineFormConfig.developmentPlanOptions;
    }

    const active = routineFormConfig.developmentPlanOptions.find(
      (plan) => plan.id === data.activePlan?.id
    );
    const rest = routineFormConfig.developmentPlanOptions.filter(
      (plan) => plan.id !== data.activePlan?.id
    );

    return active ? [active, ...rest] : routineFormConfig.developmentPlanOptions;
  }, [data.activePlan, routineFormConfig.developmentPlanOptions]);

  const canCreatePlan = evaluationOptions.length > 0;
  const canCreateRoutine = Boolean(selectedDiscipline);
  const canGenerateReport = data.report.canGenerate && Boolean(selectedDiscipline);
  const hasEvaluationForSelectedDiscipline = Boolean(data.latestEvaluation);
  const hasAnyEvaluations = data.flags.hasEvaluations;
  const playerName = useMemo(() => {
    const source = data.activePlan ?? data.latestEvaluation ?? data.evaluationHistory[0];
    if (!source || typeof source !== "object") return "this player";

    const firstName =
      "firstName" in source && typeof source.firstName === "string"
        ? source.firstName
        : null;
    const lastName =
      "lastName" in source && typeof source.lastName === "string"
        ? source.lastName
        : null;

    return [firstName, lastName].filter(Boolean).join(" ") || "this player";
  }, [data.activePlan, data.evaluationHistory, data.latestEvaluation]);

  const closeDrawer = () => {
    setActiveAction(null);
    setInitialPlanEvaluationId("");
    setIsPlanEvaluationLocked(false);
    setInitialRoutineDevelopmentPlanId("");
    setIsRoutinePlanLocked(false);
  };

  const openEvaluationDrawer = () => {
    setActiveAction("evaluation");
    setInitialPlanEvaluationId("");
    setIsPlanEvaluationLocked(false);
    setInitialRoutineDevelopmentPlanId("");
    setIsRoutinePlanLocked(false);
  };

  const openReportOptions = () => {
    if (!canGenerateReport || !selectedDiscipline) {
      return;
    }

    setIsReportOptionsOpen(true);
  };

  const closeReportOptions = () => {
    setIsReportOptionsOpen(false);
  };

  const openEvaluationView = (evaluationId: string) => {
    setViewDocument({ id: evaluationId, type: "evaluation" });
  };

  const openDevelopmentPlanView = (developmentPlanId: string) => {
    setViewDocument({ id: developmentPlanId, type: "development-plan" });
  };

  const openReportPreview = (options: {
    includeEvidence: boolean;
    routineIds: string[];
  }) => {
    if (!selectedDiscipline) {
      return;
    }

    closeReportOptions();
    window.open(
      buildDevelopmentReportPdfPath({
        playerId,
        disciplineId: selectedDiscipline.id,
        includeEvidence: options.includeEvidence,
        routineIds: options.routineIds,
      }),
      "_blank",
      "noopener,noreferrer"
    );
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

  const openRoutineDrawer = (
    developmentPlanId = data.activePlan?.id ??
      developmentPlanOptions[0]?.id ??
      "",
    isLocked = false
  ) => {
    setInitialRoutineDevelopmentPlanId(developmentPlanId);
    setIsRoutinePlanLocked(isLocked);
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

  if (!hasAnyEvaluations || !selectedDiscipline) {
    return (
      <>
        <Card shadow="sm">
          <CardBody className="flex min-h-[320px] items-center justify-center px-6 py-12 text-center">
            <div className="max-w-md space-y-4">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Development</h2>
                <p className="text-sm text-muted-foreground">
                  No development data exists yet for this athlete. Add an
                  evaluation to begin the development workflow.
                </p>
              </div>
              <div className="flex justify-center">
                <Button color="primary" size="lg" onPress={openEvaluationDrawer}>
                  Create Evaluation
                </Button>
              </div>
            </div>
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
            <h2 className="text-lg font-semibold">Development</h2>
            <p className="text-sm text-muted-foreground">
              Evaluation, development plan, and routine context for coaches.
            </p>
            <DevelopmentActionButtons
              canCreatePlan={canCreatePlan}
              canCreateRoutine={canCreateRoutine}
              canGenerateReport={canGenerateReport}
              onOpenEvaluation={openEvaluationDrawer}
              onOpenPlan={() => openPlanDrawer()}
              onOpenRoutine={() => openRoutineDrawer()}
              onOpenReport={openReportOptions}
            />
            <DevelopmentDisciplineSelector
              selectedDisciplineId={selectedDiscipline.id}
              disciplines={data.disciplineOptions}
            />
          </CardBody>
        </Card>

        {!hasEvaluationForSelectedDiscipline ? (
          <Card shadow="sm">
            <CardBody className="flex min-h-[300px] items-center justify-center px-6 py-12 text-center">
              <div className="max-w-md space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">
                    No {selectedDiscipline.label.toLowerCase()} evaluation yet
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    This discipline is available, but no evaluation has been
                    created for this player yet. Create the first evaluation to
                    start the development workflow for this tab.
                  </p>
                </div>
                <div className="flex justify-center">
                  <Button color="primary" size="lg" onPress={openEvaluationDrawer}>
                    Create Evaluation
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ) : (
          <>
            <CurrentSnapshotPanel
              latestEvaluation={data.latestEvaluation}
              disciplineKey={selectedDiscipline.key}
              onViewEvaluation={openEvaluationView}
            />

            <ActivePlanPanel
              activePlan={data.activePlan}
              latestEvaluation={data.latestEvaluation}
              disciplineKey={selectedDiscipline.key}
              onCreatePlanFromLatestEvaluation={() =>
                openPlanDrawer(data.latestEvaluation?.id ?? "")
              }
              onViewPlan={openDevelopmentPlanView}
            />

            <RoutinesPanel
              playerRoutines={data.playerRoutines}
              universalRoutinesSupported={data.universalRoutinesSupported}
              disciplineKey={selectedDiscipline.key}
              onOpenRoutine={() => openRoutineDrawer()}
            />

            <DevelopmentHistoryPanel
              evaluationHistory={data.evaluationHistory}
              developmentPlanHistory={data.developmentPlanHistory}
              disciplineKey={selectedDiscipline.key}
              onCreatePlanFromEvaluation={(evaluationId) =>
                openPlanDrawer(evaluationId)
              }
              onViewEvaluation={openEvaluationView}
              onViewPlan={openDevelopmentPlanView}
            />
          </>
        )}
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
              onSavedAndContinue={(developmentPlanId) => {
                openRoutineDrawer(developmentPlanId, true);
              }}
            >
              <DevelopmentPlanForm onCancel={closeDrawer} />
            </DevelopmentPlanFormProvider>
          </div>
        ) : activeAction === "routine" ? (
          <div className="-mx-6 -my-5 h-full">
            <RoutineFormProvider
              mode="create"
              createdBy={createdBy}
              developmentPlanOptions={developmentPlanOptions}
              mechanicOptions={routineFormConfig.mechanicOptions}
              drillOptions={routineFormConfig.drillOptions}
              initialDevelopmentPlanId={initialRoutineDevelopmentPlanId}
              isDevelopmentPlanSelectionLocked={isRoutinePlanLocked}
              onSaved={() => {
                closeDrawer();
                router.refresh();
              }}
            >
              <RoutineForm onCancel={closeDrawer} />
            </RoutineFormProvider>
          </div>
        ) : null}
      </RightSideDrawer>

      <DevelopmentReportOptionsModal
        isOpen={isReportOptionsOpen}
        playerName={playerName}
        routines={data.playerRoutines.map((routine) => ({
          id: routine.id,
          title: routine.title,
          routineType: routine.routineType,
        }))}
        onClose={closeReportOptions}
        onPreview={openReportPreview}
      />

      <DevelopmentDocumentModal
        isOpen={viewDocument !== null}
        documentId={viewDocument?.id ?? null}
        documentType={viewDocument?.type ?? null}
        onClose={() => setViewDocument(null)}
      />
    </>
  );
}
