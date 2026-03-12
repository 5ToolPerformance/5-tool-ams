import { Button, Card, CardBody, Chip } from "@heroui/react";

import { parseEvaluationSummary } from "@/application/players/development/documentDataParsers";
import type { EvaluationRow } from "@/application/players/development/getPlayerDevelopmentTabData";
import { SectionShell } from "@/ui/core/athletes/SectionShell";

import { formatDate, getDisciplineAccentClass } from "./utils";

interface CurrentSnapshotPanelProps {
  latestEvaluation: EvaluationRow | null;
  disciplineKey?: string;
}

export function CurrentSnapshotPanel({
  latestEvaluation,
  disciplineKey,
}: CurrentSnapshotPanelProps) {
  if (!latestEvaluation) {
    return (
      <SectionShell
        title="Current Snapshot"
        description="Latest evaluation context for the selected discipline."
      >
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            No evaluation exists yet for this discipline. Create an evaluation to
            establish development context.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" color="primary" isDisabled>
              New Evaluation
            </Button>
            <Button size="sm" variant="flat" isDisabled>
              New Development Plan
            </Button>
            <Button size="sm" variant="flat" isDisabled>
              New Routine
            </Button>
          </div>
        </div>
      </SectionShell>
    );
  }

  const parsed = parseEvaluationSummary(latestEvaluation.documentData);
  const accentClass = getDisciplineAccentClass(disciplineKey);

  return (
    <SectionShell
      title="Current Snapshot"
      description="Latest evaluation context for the selected discipline."
    >
      <Card
        shadow="none"
        className={`border border-l-4 border-zinc-200 bg-content1 dark:border-zinc-700 ${accentClass}`}
      >
        <CardBody className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Chip size="sm" variant="flat">
              {latestEvaluation.evaluationType}
            </Chip>
            <Chip size="sm" variant="flat">
              {latestEvaluation.phase}
            </Chip>
            <Chip size="sm" variant="flat">
              {formatDate(latestEvaluation.evaluationDate)}
            </Chip>
          </div>

          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Snapshot:</span>{" "}
              {latestEvaluation.snapshotSummary}
            </p>
            <p>
              <span className="font-medium">Strength Profile:</span>{" "}
              {latestEvaluation.strengthProfileSummary}
            </p>
            <p>
              <span className="font-medium">Constraints:</span>{" "}
              {latestEvaluation.keyConstraintsSummary}
            </p>
          </div>

          {(parsed.phaseNote || parsed.focusAreaTitles.length > 0) && (
            <div className="space-y-2 text-sm text-muted-foreground">
              {parsed.phaseNote && <p>{parsed.phaseNote}</p>}
              {parsed.focusAreaTitles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {parsed.focusAreaTitles.map((title) => (
                    <Chip key={title} size="sm" variant="bordered">
                      {title}
                    </Chip>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button size="sm" color="primary" isDisabled>
              New Evaluation
            </Button>
            <Button size="sm" variant="flat" isDisabled>
              New Development Plan
            </Button>
            <Button size="sm" variant="flat" isDisabled>
              New Routine
            </Button>
          </div>
        </CardBody>
      </Card>
    </SectionShell>
  );
}
