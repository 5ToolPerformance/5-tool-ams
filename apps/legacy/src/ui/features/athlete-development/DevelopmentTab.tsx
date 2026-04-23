"use client";

import { useMemo, useState } from "react";

import { Button, Card, CardBody, Spinner } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import type {
  DevelopmentPlanDetailData,
  EvaluationDetailData,
} from "@/application/players/development/getDevelopmentDocumentDetails";
import type { PlayerDevelopmentTabData } from "@/application/players/development/getPlayerDevelopmentTabData";
import type { PlayerDevelopmentPageBootstrapData } from "@/application/players/development/loadPlayerDevelopmentPageData";
import type { RoutineFormConfig } from "@/application/routines/getRoutineFormConfig";
import { usePlayerDevelopmentPageData } from "@/hooks/usePlayerDevelopmentPageData";
import { RightSideDrawer } from "@/ui/core/RightSideDrawer";
import { DevelopmentPlanForm } from "@/ui/features/development/forms/development-plan/DevelopmentPlanForm";
import { DevelopmentPlanFormProvider } from "@/ui/features/development/forms/development-plan/DevelopmentPlanFormProvider";
import type {
  DevelopmentPlanEvaluationOption,
  DevelopmentPlanFormRecord,
  DevelopmentPlanStatus,
} from "@/ui/features/development/forms/development-plan/developmentPlanForm.types";
import { EvaluationForm } from "@/ui/features/development/forms/evaluation/EvaluationForm";
import { EvaluationFormProvider } from "@/ui/features/development/forms/evaluation/EvaluationFormProvider";
import type {
  EvaluationBucketOption,
  EvaluationDisciplineOption,
  EvaluationFormEvidence,
  EvaluationFormRecord,
  EvaluationType,
  AthletePhase,
} from "@/ui/features/development/forms/evaluation/evaluationForm.types";
import { RoutineForm } from "@/ui/features/development/forms/routines/RoutineForm";
import { RoutineFormProvider } from "@/ui/features/development/forms/routines/RoutineFormProvider";
import { copyTextToClipboard } from "@/utils/clipboard";
import { buildPlayerRoutinesPdfPath } from "@/application/reports/playerRoutinesPdfQuery";

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
  initialPageData: PlayerDevelopmentPageBootstrapData;
  evaluationDisciplineOptions: EvaluationDisciplineOption[];
  evaluationBucketOptions: EvaluationBucketOption[];
}

type DevelopmentDrawerAction = "evaluation" | "plan" | "routine" | null;
type DevelopmentDocumentViewState =
  | { id: string; type: "evaluation" | "development-plan" }
  | null;
type DevelopmentEditAction = "evaluation-edit" | "plan-edit";

function isErrorPayload(
  payload: EvaluationDetailData | DevelopmentPlanDetailData | { error?: string } | null
): payload is { error?: string } {
  return Boolean(payload && typeof payload === "object" && "error" in payload);
}

function toEvaluationFormRecord(
  evaluation: EvaluationDetailData
): EvaluationFormRecord {
  const evidenceForms: EvaluationFormEvidence[] = evaluation.evidenceForms.map(
    (item, index) => ({
      ...item,
      id: item.evidenceId ?? `evidence-${index}`,
      recordedAt:
        item.recordedAt instanceof Date
          ? item.recordedAt.toISOString()
          : item.recordedAt ?? "",
      notes: item.notes ?? "",
    })
  );

  return {
    id: evaluation.id,
    playerId: evaluation.playerId,
    disciplineId: evaluation.disciplineId,
    createdBy: evaluation.createdBy,
    evaluationDate: evaluation.evaluationDate,
    evaluationType: evaluation.evaluationType as EvaluationType,
    phase: evaluation.phase as AthletePhase,
    injuryConsiderations: evaluation.injuryConsiderations,
    snapshotSummary: evaluation.snapshotSummary,
    strengthProfileSummary: evaluation.strengthProfileSummary,
    keyConstraintsSummary: evaluation.keyConstraintsSummary,
    documentData: evaluation.documentData as EvaluationFormRecord["documentData"],
    evidenceForms,
    mediaAttachments: evaluation.mediaAttachments,
  };
}

function toDevelopmentPlanFormRecord(
  plan: DevelopmentPlanDetailData
): DevelopmentPlanFormRecord {
  return {
    id: plan.id,
    playerId: plan.playerId,
    disciplineId: plan.disciplineId,
    evaluationId: plan.evaluationId,
    createdBy: plan.createdBy,
    status: plan.status as DevelopmentPlanStatus,
    startDate: plan.startDate,
    targetEndDate: plan.targetEndDate,
    documentData: plan.documentData as DevelopmentPlanFormRecord["documentData"],
  };
}

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
  initialPageData,
  evaluationDisciplineOptions,
  evaluationBucketOptions,
}: DevelopmentTabProps) {
  const searchParams = useSearchParams();
  const discipline = searchParams.get("discipline");
  const {
    data: pageData,
    isLoading: isPageDataLoading,
    refresh,
  } = usePlayerDevelopmentPageData(playerId, discipline, initialPageData);
  const [activeAction, setActiveAction] =
    useState<DevelopmentDrawerAction>(null);
  const [initialPlanEvaluationId, setInitialPlanEvaluationId] = useState("");
  const [isPlanEvaluationLocked, setIsPlanEvaluationLocked] = useState(false);
  const [initialRoutineDevelopmentPlanId, setInitialRoutineDevelopmentPlanId] =
    useState("");
  const [isRoutinePlanLocked, setIsRoutinePlanLocked] = useState(false);
  const [isReportOptionsOpen, setIsReportOptionsOpen] = useState(false);
  const [reportOptionRoutines, setReportOptionRoutines] = useState<
    Array<{ id: string; title: string; routineType: string }>
  >([]);
  const [viewDocument, setViewDocument] =
    useState<DevelopmentDocumentViewState>(null);
  const [editAction, setEditAction] = useState<DevelopmentEditAction | null>(null);
  const [initialEvaluationRecord, setInitialEvaluationRecord] =
    useState<EvaluationFormRecord | null>(null);
  const [initialDevelopmentPlanRecord, setInitialDevelopmentPlanRecord] =
    useState<DevelopmentPlanFormRecord | null>(null);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const data = pageData?.data ?? initialPageData.data;
  const routineFormConfig =
    pageData?.routineFormConfig ?? initialPageData.routineFormConfig;

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
  const canGenerateReport = data.playerRoutines.length > 0;
  const canCopyRawJson = Boolean(data.latestEvaluation && data.activePlan);
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
    setEditAction(null);
    setInitialPlanEvaluationId("");
    setIsPlanEvaluationLocked(false);
    setInitialRoutineDevelopmentPlanId("");
    setIsRoutinePlanLocked(false);
    setInitialEvaluationRecord(null);
    setInitialDevelopmentPlanRecord(null);
    setIsEditLoading(false);
    setEditError(null);
  };

  const refreshDevelopmentData = async () => {
    const next = await refresh();
    return next ?? pageData ?? initialPageData;
  };

  const openEvaluationDrawer = () => {
    setActiveAction("evaluation");
    setEditAction(null);
    setInitialPlanEvaluationId("");
    setIsPlanEvaluationLocked(false);
    setInitialRoutineDevelopmentPlanId("");
    setIsRoutinePlanLocked(false);
    setInitialEvaluationRecord(null);
    setInitialDevelopmentPlanRecord(null);
    setIsEditLoading(false);
    setEditError(null);
  };

  const openReportOptions = (
    routines = data.playerRoutines
  ) => {
    if (!canGenerateReport || routines.length === 0) {
      return;
    }

    setReportOptionRoutines(
      routines.map((routine) => ({
        id: routine.id,
        title: routine.title,
        routineType: routine.routineType,
      }))
    );
    setIsReportOptionsOpen(true);
  };

  const closeReportOptions = () => {
    setIsReportOptionsOpen(false);
    setReportOptionRoutines([]);
  };

  const openEvaluationView = (evaluationId: string) => {
    setViewDocument({ id: evaluationId, type: "evaluation" });
  };

  const openDevelopmentPlanView = (developmentPlanId: string) => {
    setViewDocument({ id: developmentPlanId, type: "development-plan" });
  };

  const openEvaluationEditDrawer = async (evaluationId: string) => {
    setViewDocument(null);
    setActiveAction(null);
    setEditAction("evaluation-edit");
    setInitialEvaluationRecord(null);
    setInitialDevelopmentPlanRecord(null);
    setIsEditLoading(true);
    setEditError(null);

    try {
      const response = await fetch(`/api/evaluations/${evaluationId}`);
      const payload = (await response.json().catch(() => null)) as
        | EvaluationDetailData
        | { error?: string }
        | null;

      if (!response.ok || !payload || isErrorPayload(payload)) {
        throw new Error(
          isErrorPayload(payload)
            ? payload.error ?? "Unable to load evaluation."
            : "Unable to load evaluation."
        );
      }

      setInitialEvaluationRecord(toEvaluationFormRecord(payload));
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Unable to load evaluation.";
      setEditError(message);
      toast.error(message);
    } finally {
      setIsEditLoading(false);
    }
  };

  const openDevelopmentPlanEditDrawer = async (developmentPlanId: string) => {
    setViewDocument(null);
    setActiveAction(null);
    setEditAction("plan-edit");
    setInitialEvaluationRecord(null);
    setInitialDevelopmentPlanRecord(null);
    setIsEditLoading(true);
    setEditError(null);

    try {
      const response = await fetch(`/api/development-plans/${developmentPlanId}`);
      const payload = (await response.json().catch(() => null)) as
        | DevelopmentPlanDetailData
        | { error?: string }
        | null;

      if (!response.ok || !payload || isErrorPayload(payload)) {
        throw new Error(
          isErrorPayload(payload)
            ? payload.error ?? "Unable to load development plan."
            : "Unable to load development plan."
        );
      }

      setInitialDevelopmentPlanRecord(toDevelopmentPlanFormRecord(payload));
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load development plan.";
      setEditError(message);
      toast.error(message);
    } finally {
      setIsEditLoading(false);
    }
  };

  const openReportPreview = (options: {
    routineIds: string[];
  }) => {
    if (options.routineIds.length === 0) {
      return;
    }

    closeReportOptions();
    window.open(
      buildPlayerRoutinesPdfPath({
        playerId,
        routineIds: options.routineIds,
      }),
      "_blank",
      "noopener,noreferrer"
    );
  };

  const copyRawJson = async () => {
    if (!data.latestEvaluation || !data.activePlan) {
      return;
    }

    try {
      const [evaluationResponse, planResponse] = await Promise.all([
        fetch(`/api/evaluations/${data.latestEvaluation.id}`),
        fetch(`/api/development-plans/${data.activePlan.id}`),
      ]);

      const [evaluationPayload, planPayload] = await Promise.all([
        evaluationResponse.json().catch(() => null),
        planResponse.json().catch(() => null),
      ]);

      if (
        !evaluationResponse.ok ||
        !planResponse.ok ||
        !evaluationPayload ||
        !planPayload ||
        isErrorPayload(
          evaluationPayload as EvaluationDetailData | { error?: string } | null
        ) ||
        isErrorPayload(
          planPayload as DevelopmentPlanDetailData | { error?: string } | null
        )
      ) {
        throw new Error("Unable to copy raw JSON.");
      }

      const payload = {
        evaluation:
          "copyPayload" in evaluationPayload &&
          typeof evaluationPayload.copyPayload === "object"
            ? evaluationPayload.copyPayload
            : evaluationPayload,
        developmentPlan:
          "copyPayload" in planPayload && typeof planPayload.copyPayload === "object"
            ? planPayload.copyPayload
            : planPayload,
      };

      await copyTextToClipboard(JSON.stringify(payload, null, 2));
      toast.success("Raw JSON copied.");
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Unable to copy raw JSON.";
      toast.error(message);
    }
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
    developmentPlanId = "",
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
      : editAction === "evaluation-edit"
      ? "Edit Evaluation"
      : editAction === "plan-edit"
      ? "Edit Development Plan"
      : "";

  if (!selectedDiscipline) {
    return (
      <>
        <Card shadow="sm">
          <CardBody className="flex min-h-[320px] items-center justify-center px-6 py-12 text-center">
            <div className="max-w-md space-y-4">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Development</h2>
                  <p className="text-sm text-muted-foreground">
                    No development disciplines are available for this athlete yet.
                    Add an evaluation to begin the development workflow.
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
                onSaved={async () => {
                  await refreshDevelopmentData();
                  closeDrawer();
                }}
                onSavedAndContinue={(evaluationId) => {
                  void (async () => {
                    const nextPageData = await refreshDevelopmentData();
                    closeDrawer();
                    const nextData = nextPageData.data;
                    const nextEvaluationId =
                      nextData.latestEvaluation?.id === evaluationId ||
                      nextData.evaluationHistory.some(
                        (evaluation) => evaluation.id === evaluationId
                      )
                        ? evaluationId
                        : nextData.latestEvaluation?.id ?? evaluationId;
                    openPlanDrawer(nextEvaluationId, true);
                  })();
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
        {isPageDataLoading ? (
          <Card shadow="sm">
            <CardBody className="flex min-h-[160px] items-center justify-center">
              <Spinner label="Refreshing development data" />
            </CardBody>
          </Card>
        ) : null}
        <Card shadow="sm">
          <CardBody className="space-y-3">
            <h2 className="text-lg font-semibold">Development</h2>
            <p className="text-sm text-muted-foreground">
              Evaluation, development plan, and routine context for coaches.
            </p>
            <DevelopmentActionButtons
              canCreatePlan={canCreatePlan}
              canCreateRoutine={canCreateRoutine}
              canExportPdf={canGenerateReport}
              canCopyRawJson={canCopyRawJson}
              onOpenEvaluation={openEvaluationDrawer}
              onOpenPlan={() => openPlanDrawer()}
              onOpenRoutine={() => openRoutineDrawer()}
              onExportPdf={() => openReportOptions()}
              onCopyRawJson={() => {
                void copyRawJson();
              }}
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
                    start the development-plan workflow for this tab. Routines can
                    still be created below.
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
              onEditEvaluation={openEvaluationEditDrawer}
            />

            <ActivePlanPanel
              activePlan={data.activePlan}
              latestEvaluation={data.latestEvaluation}
              disciplineKey={selectedDiscipline.key}
              onCreatePlanFromLatestEvaluation={() =>
                openPlanDrawer(data.latestEvaluation?.id ?? "")
              }
              onViewPlan={openDevelopmentPlanView}
              onEditPlan={openDevelopmentPlanEditDrawer}
            />
          </>
        )}

        <RoutinesPanel
          playerId={playerId}
          playerRoutines={data.playerRoutines}
          universalRoutines={data.universalRoutines}
          universalRoutinesSupported={data.universalRoutinesSupported}
          activePlanId={data.activePlan?.id}
          disciplineId={selectedDiscipline.id}
          disciplineKey={selectedDiscipline.key}
          disciplineLabel={selectedDiscipline.label}
          onOpenRoutine={() => openRoutineDrawer()}
          onOpenRoutineExport={openReportOptions}
        />

        {hasAnyEvaluations || data.developmentPlanHistory.length > 0 ? (
          <DevelopmentHistoryPanel
            evaluationHistory={data.evaluationHistory}
            developmentPlanHistory={data.developmentPlanHistory}
            disciplineKey={selectedDiscipline.key}
            onCreatePlanFromEvaluation={(evaluationId) =>
              openPlanDrawer(evaluationId)
            }
            onViewEvaluation={openEvaluationView}
            onViewPlan={openDevelopmentPlanView}
            onEditEvaluation={openEvaluationEditDrawer}
            onEditPlan={openDevelopmentPlanEditDrawer}
          />
        ) : null}
      </div>

      <RightSideDrawer
        isOpen={activeAction !== null || editAction !== null}
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
              onSaved={async () => {
                await refreshDevelopmentData();
                closeDrawer();
              }}
              onSavedAndContinue={(evaluationId) => {
                void (async () => {
                  const nextPageData = await refreshDevelopmentData();
                  closeDrawer();
                  const nextData = nextPageData.data;
                  const nextEvaluationId =
                    nextData.latestEvaluation?.id === evaluationId ||
                    nextData.evaluationHistory.some(
                      (evaluation) => evaluation.id === evaluationId
                    )
                      ? evaluationId
                      : nextData.latestEvaluation?.id ?? evaluationId;
                  openPlanDrawer(nextEvaluationId, true);
                })();
              }}
            >
              <EvaluationForm onCancel={closeDrawer} />
            </EvaluationFormProvider>
          </div>
        ) : editAction === "evaluation-edit" ? (
          <div className="-mx-6 -my-5 h-full">
            {isEditLoading ? (
              <div className="flex h-full items-center justify-center">
                <Spinner label="Loading evaluation" />
              </div>
            ) : editError ? (
              <div className="p-6 text-sm text-danger">{editError}</div>
            ) : initialEvaluationRecord ? (
              <EvaluationFormProvider
                mode="edit"
                createdBy={createdBy}
                disciplineOptions={evaluationDisciplineOptions}
                bucketOptions={evaluationBucketOptions}
                initialEvaluation={initialEvaluationRecord}
                onSaved={async () => {
                  await refreshDevelopmentData();
                  closeDrawer();
                }}
              >
                <EvaluationForm onCancel={closeDrawer} />
              </EvaluationFormProvider>
            ) : null}
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
              onSaved={async () => {
                await refreshDevelopmentData();
                closeDrawer();
              }}
              onSavedAndContinue={(developmentPlanId) => {
                void (async () => {
                  const nextPageData = await refreshDevelopmentData();
                  closeDrawer();
                  const nextPlanOptions =
                    nextPageData.routineFormConfig.developmentPlanOptions;
                  const nextPlanId = nextPlanOptions.some(
                    (plan) => plan.id === developmentPlanId
                  )
                    ? developmentPlanId
                    : nextPlanOptions[0]?.id ?? developmentPlanId;
                  openRoutineDrawer(nextPlanId, true);
                })();
              }}
            >
              <DevelopmentPlanForm onCancel={closeDrawer} />
            </DevelopmentPlanFormProvider>
          </div>
        ) : editAction === "plan-edit" ? (
          <div className="-mx-6 -my-5 h-full">
            {isEditLoading ? (
              <div className="flex h-full items-center justify-center">
                <Spinner label="Loading development plan" />
              </div>
            ) : editError ? (
              <div className="p-6 text-sm text-danger">{editError}</div>
            ) : initialDevelopmentPlanRecord ? (
              <DevelopmentPlanFormProvider
                mode="edit"
                createdBy={createdBy}
                evaluationOptions={evaluationOptions}
                initialDevelopmentPlan={initialDevelopmentPlanRecord}
                onSaved={async () => {
                  await refreshDevelopmentData();
                  closeDrawer();
                }}
              >
                <DevelopmentPlanForm onCancel={closeDrawer} />
              </DevelopmentPlanFormProvider>
            ) : null}
          </div>
        ) : activeAction === "routine" ? (
          <div className="-mx-6 -my-5 h-full">
            <RoutineFormProvider
              mode="create"
              createdBy={createdBy}
              initialPlayerId={playerId}
              developmentPlanOptions={developmentPlanOptions}
              disciplineOptions={routineFormConfig.disciplineOptions}
              mechanicOptions={routineFormConfig.mechanicOptions}
              drillOptions={routineFormConfig.drillOptions}
              initialDevelopmentPlanId={initialRoutineDevelopmentPlanId}
              initialDisciplineId={selectedDiscipline?.id}
              isDevelopmentPlanSelectionLocked={isRoutinePlanLocked}
              onSaved={async () => {
                await refreshDevelopmentData();
                closeDrawer();
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
        routines={reportOptionRoutines}
        onClose={closeReportOptions}
        onPreview={openReportPreview}
      />

      <DevelopmentDocumentModal
        isOpen={viewDocument !== null}
        documentId={viewDocument?.id ?? null}
        documentType={viewDocument?.type ?? null}
        onEditDocument={(documentId, documentType) => {
          if (documentType === "evaluation") {
            void openEvaluationEditDrawer(documentId);
            return;
          }

          void openDevelopmentPlanEditDrawer(documentId);
        }}
        onClose={() => setViewDocument(null)}
      />
    </>
  );
}


