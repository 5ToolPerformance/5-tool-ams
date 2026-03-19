import { Button, Card, CardBody, Chip } from "@heroui/react";

import { parseDevelopmentPlanSummary } from "@/application/players/development/documentDataParsers";
import type {
  DevelopmentPlanRow,
  EvaluationRow,
} from "@/application/players/development/getPlayerDevelopmentTabData";
import { SectionShell } from "@/ui/core/athletes/SectionShell";

import { formatDate, getDisciplineAccentClass } from "./utils";

interface ActivePlanPanelProps {
  activePlan: DevelopmentPlanRow | null;
  latestEvaluation: EvaluationRow | null;
  disciplineKey?: string;
  onCreatePlanFromLatestEvaluation?: () => void;
  onOpenEvaluation?: () => void;
  onOpenRoutine?: () => void;
}

export function ActivePlanPanel({
  activePlan,
  latestEvaluation,
  disciplineKey,
  onCreatePlanFromLatestEvaluation,
  onOpenEvaluation,
  onOpenRoutine,
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
          <div className="flex flex-wrap gap-2">
            {latestEvaluation ? (
              <Button
                size="sm"
                color="primary"
                onPress={onCreatePlanFromLatestEvaluation}
              >
                Create Plan from Latest Evaluation
              </Button>
            ) : (
              <Button size="sm" color="primary" onPress={onOpenEvaluation}>
                New Evaluation
              </Button>
            )}
          </div>
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
        <CardBody className="space-y-3">
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
          </div>

          <div className="space-y-2 text-sm">
            {parsed.summary && (
              <p>
                <span className="font-medium">Summary:</span> {parsed.summary}
              </p>
            )}
            {parsed.currentPriority && (
              <p>
                <span className="font-medium">Current Priority:</span>{" "}
                {parsed.currentPriority}
              </p>
            )}
          </div>

          {parsed.shortTermGoalTitles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {parsed.shortTermGoalTitles.map((goal) => (
                <Chip key={goal} size="sm" variant="bordered">
                  {goal}
                </Chip>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button size="sm" variant="flat" isDisabled>
              View Plan
            </Button>
            <Button size="sm" variant="flat" isDisabled>
              Edit Plan
            </Button>
            <Button size="sm" color="primary" onPress={onOpenRoutine}>
              Create Routine
            </Button>
          </div>
        </CardBody>
      </Card>
    </SectionShell>
  );
}
