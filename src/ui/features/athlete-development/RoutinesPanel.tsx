"use client";

import { useMemo, useState, type ReactNode } from "react";

import { Button, Card, CardBody, Chip, Input } from "@heroui/react";
import { Search } from "lucide-react";
import { toast } from "sonner";

import { parseRoutineSummary } from "@/application/players/development/documentDataParsers";
import type {
  RoutineRow,
  UniversalRoutineRow,
} from "@/application/players/development/getPlayerDevelopmentTabData";
import { buildPlayerRoutinesPdfPath } from "@/lib/reports/playerRoutinesPdfQuery";
import { buildUniversalRoutinePdfPath } from "@/lib/reports/universalRoutinePdfQuery";
import { SectionShell } from "@/ui/core/athletes/SectionShell";
import {
  RoutineViewData,
  RoutineViewModal,
} from "@/ui/features/routines/RoutineViewModal";

import { getDisciplineAccentClass } from "./utils";

interface RoutinesPanelProps {
  playerId: string;
  playerRoutines: RoutineRow[];
  universalRoutines: UniversalRoutineRow[];
  universalRoutinesSupported: boolean;
  activePlanId?: string;
  disciplineId?: string;
  disciplineKey?: string;
  disciplineLabel?: string;
  onOpenRoutine?: () => void;
  onOpenRoutineExport?: () => void;
  onAssignedUniversalRoutine?: () => void;
}

function RoutineCard({
  routine,
  accentClass,
  footer,
}: {
  routine: {
    id: string;
    title: string;
    description: string | null;
    routineType: string;
    isActive: boolean;
    documentData: unknown;
  };
  accentClass: string;
  footer?: ReactNode;
}) {
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
            {routine.description ? (
              <p className="text-sm text-muted-foreground">{routine.description}</p>
            ) : null}
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

        {parsed.summary ? (
          <p className="text-sm text-muted-foreground">{parsed.summary}</p>
        ) : null}

        {parsed.mechanicPreview.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {parsed.mechanicPreview.map((mechanic) => (
              <Chip key={mechanic} size="sm" variant="flat">
                {mechanic}
              </Chip>
            ))}
          </div>
        ) : null}

        {footer}
      </CardBody>
    </Card>
  );
}

export function RoutinesPanel({
  playerId,
  playerRoutines,
  universalRoutines,
  universalRoutinesSupported,
  activePlanId,
  disciplineId,
  disciplineKey,
  disciplineLabel,
  onOpenRoutine,
  onOpenRoutineExport,
  onAssignedUniversalRoutine,
}: RoutinesPanelProps) {
  const accentClass = getDisciplineAccentClass(disciplineKey);
  const [query, setQuery] = useState("");
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [viewRoutine, setViewRoutine] = useState<RoutineViewData | null>(null);

  const filteredUniversalRoutines = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return universalRoutines.filter((routine) => {
      if (!normalizedQuery) {
        return true;
      }

      const parsed = parseRoutineSummary(routine.documentData);

      return (
        routine.title.toLowerCase().includes(normalizedQuery) ||
        (routine.description ?? "").toLowerCase().includes(normalizedQuery) ||
        (parsed.summary ?? "").toLowerCase().includes(normalizedQuery) ||
        parsed.mechanicPreview.some((mechanic) =>
          mechanic.toLowerCase().includes(normalizedQuery)
        )
      );
    });
  }, [query, universalRoutines]);

  async function assignRoutine(universalRoutineId: string) {
    if (!activePlanId) {
      return;
    }

    setAssigningId(universalRoutineId);

    try {
      const response = await fetch(
        `/api/development-plans/${activePlanId}/universal-routines`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ universalRoutineId }),
        }
      );
      const result = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(result?.error ?? "Failed to assign universal routine.");
      }

      toast.success("Universal routine assigned to the development plan.");
      onAssignedUniversalRoutine?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to assign universal routine."
      );
    } finally {
      setAssigningId(null);
    }
  }

  function openRoutineView(
    routine: {
      id: string;
      title: string;
      description: string | null;
      routineType: string;
      documentData: unknown;
    },
    sourceLabel: string
  ) {
    setViewRoutine({
      id: routine.id,
      title: routine.title,
      description: routine.description,
      routineType: routine.routineType,
      sourceLabel,
      disciplineLabel,
      documentData: routine.documentData,
    });
  }

  function exportRoutine(routineId: string) {
    if (!disciplineId) {
      toast.error("Select a discipline before exporting a routine PDF.");
      return;
    }

    window.open(
      buildPlayerRoutinesPdfPath({
        playerId,
        disciplineId,
        routineIds: [routineId],
      }),
      "_blank",
      "noopener,noreferrer"
    );
  }

  function exportUniversalRoutine(routineId: string) {
    window.open(
      buildUniversalRoutinePdfPath({ routineId }),
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <>
      <SectionShell
        title="Routines"
        description="Routines currently available in this athlete's development context."
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">Player Routines</h3>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {playerRoutines.length > 0 ? (
                  <Button size="sm" variant="flat" onPress={onOpenRoutineExport}>
                    Export Routines
                  </Button>
                ) : null}
                <Button size="sm" color="primary" onPress={onOpenRoutine}>
                  New Routine
                </Button>
              </div>
            </div>
            {playerRoutines.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No routines are available for this athlete in the selected discipline.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {playerRoutines.map((routine) => (
                  <RoutineCard
                    key={routine.id}
                    routine={routine}
                    accentClass={accentClass}
                    footer={
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Button
                          size="sm"
                          variant="flat"
                          onPress={() => openRoutineView(routine, "Player Routine")}
                        >
                          View Routine
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          onPress={() => exportRoutine(routine.id)}
                        >
                          Export PDF
                        </Button>
                        <Button size="sm" variant="flat" isDisabled>
                          Edit Routine
                        </Button>
                        <Button size="sm" color="primary" isDisabled>
                          Use in Lesson
                        </Button>
                      </div>
                    }
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Universal Routines</h3>
            {!universalRoutinesSupported ? (
              <p className="text-sm text-muted-foreground">
                Universal routines are not available for this view.
              </p>
            ) : (
              <>
                <Input
                  placeholder="Search universal routines"
                  startContent={<Search className="h-4 w-4 text-foreground-500" />}
                  value={query}
                  onValueChange={setQuery}
                />

                {!activePlanId ? (
                  <p className="text-sm text-muted-foreground">
                    Create an active development plan before assigning universal routines.
                  </p>
                ) : null}

                {filteredUniversalRoutines.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No universal routines match the current search.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    {filteredUniversalRoutines.map((routine) => (
                      <RoutineCard
                        key={routine.id}
                        routine={routine}
                        accentClass={accentClass}
                        footer={
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <Chip size="sm" variant="bordered">
                              Shared by {routine.createdByName ?? "Unknown"}
                            </Chip>
                            <Button
                              size="sm"
                              variant="flat"
                              onPress={() => openRoutineView(routine, "Universal Routine")}
                            >
                              View Routine
                            </Button>
                            <Button
                              size="sm"
                              variant="flat"
                              onPress={() => exportUniversalRoutine(routine.id)}
                            >
                              Export PDF
                            </Button>
                            <Button
                              size="sm"
                              color="primary"
                              onPress={() => assignRoutine(routine.id)}
                              isDisabled={!activePlanId}
                              isLoading={assigningId === routine.id}
                            >
                              Assign to Plan
                            </Button>
                          </div>
                        }
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </SectionShell>

      <RoutineViewModal
        isOpen={viewRoutine !== null}
        onClose={() => setViewRoutine(null)}
        routine={viewRoutine}
      />
    </>
  );
}

