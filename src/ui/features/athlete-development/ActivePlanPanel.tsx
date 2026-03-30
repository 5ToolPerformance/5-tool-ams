import { Button, Card, CardBody, Chip } from "@heroui/react";

import { parseDevelopmentPlanSummary } from "@/application/players/development/documentDataParsers";
import type {
  DevelopmentPlanRow,
  EvaluationRow,
} from "@/application/players/development/getPlayerDevelopmentTabData";
import FormattedText from "@/components/ui/formattedText";
import { SectionShell } from "@/ui/core/athletes/SectionShell";

import { formatDate, getDisciplineAccentClass } from "./utils";

interface ActivePlanPanelProps {
  activePlan: DevelopmentPlanRow | null;
  latestEvaluation: EvaluationRow | null;
  disciplineKey?: string;
  onCreatePlanFromLatestEvaluation?: () => void;
  onViewPlan?: (developmentPlanId: string) => void;
  onEditPlan?: (developmentPlanId: string) => void;
}

export function ActivePlanPanel({
  activePlan,
  latestEvaluation,
  disciplineKey,
  onCreatePlanFromLatestEvaluation,
  onViewPlan,
  onEditPlan,
}: ActivePlanPanelProps) {
  if (!activePlan) {
    return (
      <SectionShell
        title="Active Plan"
        description="Current development plan and coaching priorities."
      >
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            No active development plan exists for this discipline.
          </p>
          {latestEvaluation ? (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                color="primary"
                onPress={onCreatePlanFromLatestEvaluation}
              >
                Create Plan from Latest Evaluation
              </Button>
            </div>
          ) : null}
        </div>
      </SectionShell>
    );
  }

  const parsed = parseDevelopmentPlanSummary(activePlan.documentData);
  const accentClass = getDisciplineAccentClass(disciplineKey);

  return (
    <SectionShell
      title="Active Plan"
      description="Current development plan and coaching priorities."
    >
      <Card
        shadow="none"
        className={`border border-l-4 border-zinc-200 bg-content1 dark:border-zinc-700 ${accentClass}`}
      >
        <CardBody className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Chip size="sm" color="success" variant="flat">
                {activePlan.status}
              </Chip>
              <Chip size="sm" variant="flat">
                Start: {formatDate(activePlan.startDate)}
              </Chip>
              <Chip size="sm" variant="flat">
                Target End: {formatDate(activePlan.targetEndDate)}
              </Chip>
              <Chip size="sm" color="secondary" variant="flat">
                {parsed.shortTermGoalTitles.length} short-term goal
                {parsed.shortTermGoalTitles.length === 1 ? "" : "s"}
              </Chip>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="flat"
                onPress={() => onViewPlan?.(activePlan.id)}
              >
                View Plan
              </Button>
              <Button
                size="sm"
                variant="flat"
                onPress={() => onEditPlan?.(activePlan.id)}
              >
                Edit Plan
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-default-200 bg-default-50/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Summary
              </p>
              <div className="mt-2 text-sm">
                <FormattedText text={parsed.summary ?? "No summary provided."} isShort />
              </div>
            </div>
            <div className="rounded-lg border border-default-200 bg-default-50/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Current Priority
              </p>
              <div className="mt-2 text-sm">
                <FormattedText
                  text={parsed.currentPriority ?? "No priority specified."}
                  isShort
                />
              </div>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="space-y-2 rounded-lg border border-default-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Short-Term Goals
              </p>
              {parsed.shortTermGoalTitles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {parsed.shortTermGoalTitles.map((goal) => (
                    <Chip key={goal} size="sm" variant="bordered">
                      {goal}
                    </Chip>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No short-term goals recorded.
                </p>
              )}
            </div>
            <div className="space-y-2 rounded-lg border border-default-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Long-Term Goals
              </p>
              {parsed.longTermGoalTitles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {parsed.longTermGoalTitles.map((goal) => (
                    <Chip key={goal} size="sm" variant="bordered">
                      {goal}
                    </Chip>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No long-term goals recorded.
                </p>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </SectionShell>
  );
}
