import { Button, Card, CardBody, Chip } from "@heroui/react";

import { parseRoutineSummary } from "@/application/players/development/documentDataParsers";
import type { RoutineRow } from "@/application/players/development/getPlayerDevelopmentTabData";
import { SectionShell } from "@/ui/core/athletes/SectionShell";

import { getDisciplineAccentClass } from "./utils";

interface RoutinesPanelProps {
  playerRoutines: RoutineRow[];
  universalRoutinesSupported: boolean;
  disciplineKey?: string;
  onOpenRoutine?: () => void;
}

export function RoutinesPanel({
  playerRoutines,
  universalRoutinesSupported,
  disciplineKey,
  onOpenRoutine,
}: RoutinesPanelProps) {
  const accentClass = getDisciplineAccentClass(disciplineKey);

  return (
    <SectionShell
      title="Routines"
      description="Routines currently available in this athlete's development context."
    >
      <div className="space-y-4">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Player Routines</h3>
          {playerRoutines.length === 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                No routines are available for this athlete in the selected
                discipline.
              </p>
              <Button size="sm" color="primary" onPress={onOpenRoutine}>
                New Routine
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {playerRoutines.map((routine) => {
                const parsed = parseRoutineSummary(routine.documentData);
                return (
                  <Card
                    key={routine.id}
                    shadow="none"
                    className={`border border-l-4 border-zinc-200 dark:border-zinc-700 ${accentClass}`}
                  >
                    <CardBody className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{routine.title}</p>
                          {routine.description && (
                            <p className="text-sm text-muted-foreground">
                              {routine.description}
                            </p>
                          )}
                        </div>
                        <Chip size="sm" variant="flat">
                          {routine.routineType}
                        </Chip>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Chip size="sm" variant="bordered">
                          {routine.isActive ? "Active" : "Inactive"}
                        </Chip>
                        <Chip size="sm" variant="bordered">
                          Blocks: {parsed.blockCount}
                        </Chip>
                      </div>

                      {parsed.summary && (
                        <p className="text-sm text-muted-foreground">
                          {parsed.summary}
                        </p>
                      )}

                      {parsed.mechanicPreview.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {parsed.mechanicPreview.map((mechanic) => (
                            <Chip key={mechanic} size="sm" variant="flat">
                              {mechanic}
                            </Chip>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-1">
                        <Button size="sm" variant="flat" isDisabled>
                          View Routine
                        </Button>
                        <Button size="sm" variant="flat" isDisabled>
                          Edit Routine
                        </Button>
                        <Button size="sm" color="primary" isDisabled>
                          Use in Lesson
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Universal Routines</h3>
          {!universalRoutinesSupported ? (
            <p className="text-sm text-muted-foreground">
              Universal routines are not yet wired to this tab. TODO: add
              discipline-level universal routine reads when backend support is
              finalized.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Universal routines are available for this discipline.
            </p>
          )}
          <Button size="sm" variant="flat" isDisabled>
            Browse Universal Routines
          </Button>
        </div>
      </div>
    </SectionShell>
  );
}
