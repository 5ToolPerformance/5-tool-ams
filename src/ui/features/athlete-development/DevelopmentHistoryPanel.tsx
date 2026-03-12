import { Button, Card, CardBody, Chip } from "@heroui/react";

import { parseDevelopmentPlanSummary } from "@/application/players/development/documentDataParsers";
import type {
  DevelopmentPlanRow,
  EvaluationRow,
} from "@/application/players/development/getPlayerDevelopmentTabData";
import { SectionShell } from "@/ui/core/athletes/SectionShell";

import { formatDate, getDisciplineAccentClass } from "./utils";

interface DevelopmentHistoryPanelProps {
  evaluationHistory: EvaluationRow[];
  developmentPlanHistory: DevelopmentPlanRow[];
  disciplineKey?: string;
}

export function DevelopmentHistoryPanel({
  evaluationHistory,
  developmentPlanHistory,
  disciplineKey,
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
                  <CardBody className="space-y-2">
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
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {evaluation.snapshotSummary}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="flat" isDisabled>
                        View
                      </Button>
                      <Button size="sm" variant="flat" isDisabled>
                        Edit
                      </Button>
                      <Button size="sm" color="primary" isDisabled>
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
                    <CardBody className="space-y-2">
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
                      {parsed.summary && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {parsed.summary}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="flat" isDisabled>
                          View
                        </Button>
                        <Button size="sm" variant="flat" isDisabled>
                          Edit
                        </Button>
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
