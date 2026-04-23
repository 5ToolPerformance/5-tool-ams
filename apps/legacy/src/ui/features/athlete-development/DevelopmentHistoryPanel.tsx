import { Button, Card, CardBody, Chip } from "@heroui/react";

import { parseDevelopmentPlanSummary } from "@/application/players/development/documentDataParsers";
import type {
  DevelopmentPlanRow,
  EvaluationRow,
} from "@/application/players/development/getPlayerDevelopmentTabData";
import FormattedText from "@/ui/core/primitives/formattedText";
import { SectionShell } from "@/ui/core/athletes/SectionShell";

import { formatDate, getDisciplineAccentClass } from "./utils";

interface DevelopmentHistoryPanelProps {
  evaluationHistory: EvaluationRow[];
  developmentPlanHistory: DevelopmentPlanRow[];
  disciplineKey?: string;
  onCreatePlanFromEvaluation?: (evaluationId: string) => void;
  onViewEvaluation?: (evaluationId: string) => void;
  onViewPlan?: (developmentPlanId: string) => void;
  onEditEvaluation?: (evaluationId: string) => void;
  onEditPlan?: (developmentPlanId: string) => void;
}

export function DevelopmentHistoryPanel({
  evaluationHistory,
  developmentPlanHistory,
  disciplineKey,
  onCreatePlanFromEvaluation,
  onViewEvaluation,
  onViewPlan,
  onEditEvaluation,
  onEditPlan,
}: DevelopmentHistoryPanelProps) {
  const accentClass = getDisciplineAccentClass(disciplineKey);
  const hasHistory =
    evaluationHistory.length > 0 || developmentPlanHistory.length > 0;

  return (
    <SectionShell
      title="History"
      description="Recent evaluations and development plans for this discipline."
    >
      {!hasHistory ? (
        <p className="text-sm text-muted-foreground">
          No evaluation or development plan history exists yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Evaluation History</h3>
            {evaluationHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No previous evaluations.
              </p>
            ) : (
              evaluationHistory.map((evaluation) => (
                <Card
                  key={evaluation.id}
                  shadow="none"
                  className={`border border-l-4 border-zinc-200 dark:border-zinc-700 ${accentClass}`}
                >
                  <CardBody className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Chip size="sm" variant="flat">
                          {formatDate(evaluation.evaluationDate)}
                        </Chip>
                        <Chip size="sm" variant="flat">
                          {evaluation.evaluationType}
                        </Chip>
                        <Chip size="sm" variant="flat">
                          {evaluation.phase}
                        </Chip>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="flat"
                          onPress={() => onViewEvaluation?.(evaluation.id)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          onPress={() => onEditEvaluation?.(evaluation.id)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-lg border border-default-200 bg-default-50/40 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Snapshot
                        </p>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <FormattedText text={evaluation.snapshotSummary} isShort />
                        </div>
                      </div>
                      <div className="rounded-lg border border-default-200 bg-default-50/40 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Evidence
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {Array.isArray(
                            (
                              evaluation.documentData as { evidence?: unknown[] } | null
                            )?.evidence
                          )
                            ? `${
                                (
                                  evaluation.documentData as { evidence?: unknown[] }
                                ).evidence?.length ?? 0
                              } documented evidence item(s)`
                            : "No evidence documented."}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        color="primary"
                        onPress={() => onCreatePlanFromEvaluation?.(evaluation.id)}
                      >
                        Create Plan from This
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Development Plan History</h3>
            {developmentPlanHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No development plans recorded.
              </p>
            ) : (
              developmentPlanHistory.map((plan) => {
                const parsed = parseDevelopmentPlanSummary(plan.documentData);
                return (
                  <Card
                    key={plan.id}
                    shadow="none"
                    className={`border border-l-4 border-zinc-200 dark:border-zinc-700 ${accentClass}`}
                  >
                    <CardBody className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Chip size="sm" variant="flat">
                            {plan.status}
                          </Chip>
                          <Chip size="sm" variant="flat">
                            Start: {formatDate(plan.startDate)}
                          </Chip>
                          <Chip size="sm" variant="flat">
                            End: {formatDate(plan.targetEndDate)}
                          </Chip>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="flat"
                            onPress={() => onViewPlan?.(plan.id)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="flat"
                            onPress={() => onEditPlan?.(plan.id)}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-lg border border-default-200 bg-default-50/40 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Summary
                          </p>
                          <div className="mt-2 text-sm text-muted-foreground">
                            <FormattedText
                              text={parsed.summary ?? "No summary provided."}
                              isShort
                            />
                          </div>
                        </div>
                        <div className="rounded-lg border border-default-200 bg-default-50/40 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Current Priority
                          </p>
                          <div className="mt-2 text-sm text-muted-foreground">
                            <FormattedText
                              text={parsed.currentPriority ?? "No priority specified."}
                              isShort
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {[...parsed.shortTermGoalTitles, ...parsed.longTermGoalTitles]
                          .slice(0, 4)
                          .map((goal) => (
                            <Chip key={goal} size="sm" variant="bordered">
                              {goal}
                            </Chip>
                          ))}
                      </div>
                    </CardBody>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      )}
    </SectionShell>
  );
}
