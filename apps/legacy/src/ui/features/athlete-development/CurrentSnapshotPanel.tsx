import { Button, Card, CardBody, Chip } from "@heroui/react";

import { parseEvaluationSummary } from "@/application/players/development/documentDataParsers";
import type { EvaluationRow } from "@/application/players/development/getPlayerDevelopmentTabData";
import FormattedText from "@/ui/core/primitives/formattedText";
import { SectionShell } from "@/ui/core/athletes/SectionShell";

import { formatDate, getDisciplineAccentClass } from "./utils";

interface CurrentSnapshotPanelProps {
  latestEvaluation: EvaluationRow | null;
  disciplineKey?: string;
  onViewEvaluation?: (evaluationId: string) => void;
  onEditEvaluation?: (evaluationId: string) => void;
}

export function CurrentSnapshotPanel({
  latestEvaluation,
  disciplineKey,
  onViewEvaluation,
  onEditEvaluation,
}: CurrentSnapshotPanelProps) {
  if (!latestEvaluation) {
    return (
      <SectionShell
        title="Current Snapshot"
        description="Latest evaluation context for the selected discipline."
      >
        <p className="text-sm text-muted-foreground">
          No evaluation exists yet for this discipline. Create an evaluation to
          establish development context.
        </p>
      </SectionShell>
    );
  }

  const parsed = parseEvaluationSummary(latestEvaluation.documentData);
  const accentClass = getDisciplineAccentClass(disciplineKey);
  const evidenceCount =
    parsed.focusAreaTitles.length +
    parsed.constraints.length +
    (Array.isArray((latestEvaluation.documentData as { evidence?: unknown[] } | null)?.evidence)
      ? (latestEvaluation.documentData as { evidence?: unknown[] }).evidence?.length ?? 0
      : 0);

  return (
    <SectionShell
      title="Current Snapshot"
      description="Latest evaluation context for the selected discipline."
    >
      <Card
        shadow="none"
        className={`border border-l-4 border-zinc-200 bg-content1 dark:border-zinc-700 ${accentClass}`}
      >
        <CardBody className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
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
              <Chip size="sm" color="secondary" variant="flat">
                {evidenceCount} supporting item{evidenceCount === 1 ? "" : "s"}
              </Chip>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="flat"
                onPress={() => onViewEvaluation?.(latestEvaluation.id)}
              >
                View Evaluation
              </Button>
              <Button
                size="sm"
                variant="flat"
                onPress={() => onEditEvaluation?.(latestEvaluation.id)}
              >
                Edit Evaluation
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-default-200 bg-default-50/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Snapshot
              </p>
              <div className="mt-2 text-sm">
                <FormattedText text={latestEvaluation.snapshotSummary} isShort />
              </div>
            </div>
            <div className="rounded-lg border border-default-200 bg-default-50/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Strength Profile
              </p>
              <div className="mt-2 text-sm">
                <FormattedText text={latestEvaluation.strengthProfileSummary} isShort />
              </div>
            </div>
            <div className="rounded-lg border border-default-200 bg-default-50/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Constraints
              </p>
              <div className="mt-2 text-sm">
                <FormattedText text={latestEvaluation.keyConstraintsSummary} isShort />
              </div>
            </div>
          </div>

          {(parsed.phaseNote || parsed.focusAreaTitles.length > 0 || parsed.constraints.length > 0) && (
            <div className="grid gap-3 lg:grid-cols-3">
              <div className="space-y-2 rounded-lg border border-default-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Phase Notes
                </p>
                {parsed.phaseNote ? (
                  <div className="text-sm text-muted-foreground">
                    <FormattedText text={parsed.phaseNote} isShort />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No phase notes recorded.</p>
                )}
              </div>
              <div className="space-y-2 rounded-lg border border-default-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Focus Areas
                </p>
                {parsed.focusAreaTitles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {parsed.focusAreaTitles.map((title) => (
                      <Chip key={title} size="sm" variant="bordered">
                        {title}
                      </Chip>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No focus areas recorded.</p>
                )}
              </div>
              <div className="space-y-2 rounded-lg border border-default-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Constraint Details
                </p>
                {parsed.constraints.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {parsed.constraints.map((constraint) => (
                      <Chip key={constraint} size="sm" variant="bordered">
                        {constraint}
                      </Chip>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No detailed constraints recorded.
                  </p>
                )}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </SectionShell>
  );
}
