"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Button,
  Card,
  CardBody,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

import { parseRoutineReportDetails } from "@/application/players/development/documentDataParsers";
import { DrillViewModal } from "@/ui/features/drills/DrillViewModal";
import type { Drill } from "@/ui/features/drills/types";

export type RoutineViewData = {
  id: string;
  title: string;
  description: string | null;
  routineType: string;
  sourceLabel: string;
  disciplineLabel?: string | null;
  documentData: unknown;
};

type RoutineViewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  routine: RoutineViewData | null;
};

function formatRoutineType(routineType: string) {
  return routineType.replaceAll("_", " ");
}

export function RoutineViewModal({
  isOpen,
  onClose,
  routine,
}: RoutineViewModalProps) {
  const details = useMemo(
    () => parseRoutineReportDetails(routine?.documentData),
    [routine?.documentData]
  );
  const [isDrillOpen, setIsDrillOpen] = useState(false);
  const [isLoadingDrill, setIsLoadingDrill] = useState(false);
  const [drillError, setDrillError] = useState<string | null>(null);
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsDrillOpen(false);
      setIsLoadingDrill(false);
      setDrillError(null);
      setSelectedDrill(null);
    }
  }, [isOpen]);

  async function openDrill(drillId: string | null, drillTitle: string | null) {
    if (!drillId) {
      setDrillError(
        `More drill details are unavailable for ${drillTitle ?? "this drill"}.`
      );
      return;
    }

    setDrillError(null);
    setIsDrillOpen(true);
    setIsLoadingDrill(true);
    setSelectedDrill(null);

    try {
      const response = await fetch(`/api/drills/${drillId}`);
      const payload = (await response.json().catch(() => null)) as
        | { drill?: Drill; error?: string }
        | null;

      if (!response.ok || !payload?.drill) {
        throw new Error(payload?.error ?? "Failed to load drill.");
      }

      setSelectedDrill(payload.drill);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load drill.";
      setDrillError(message);
      setIsDrillOpen(false);
    } finally {
      setIsLoadingDrill(false);
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-3">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{routine?.title ?? "Routine Details"}</h2>
              {routine?.description ? (
                <p className="text-sm text-foreground-500">{routine.description}</p>
              ) : null}
            </div>

            {routine ? (
              <div className="flex flex-wrap gap-2">
                <Chip size="sm" variant="flat">
                  {routine.sourceLabel}
                </Chip>
                <Chip size="sm" variant="flat">
                  {formatRoutineType(routine.routineType)}
                </Chip>
                {routine.disciplineLabel ? (
                  <Chip size="sm" variant="bordered">
                    {routine.disciplineLabel}
                  </Chip>
                ) : null}
              </div>
            ) : null}
          </ModalHeader>

          <ModalBody className="space-y-6">
            {drillError ? (
              <p className="rounded-md border border-danger-200 bg-danger-50 px-3 py-2 text-sm text-danger">
                {drillError}
              </p>
            ) : null}

            {details.summary || details.usageNotes ? (
              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground-500">
                  Overview
                </h3>
                {details.summary ? <p className="text-sm">{details.summary}</p> : null}
                {details.usageNotes ? (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Usage Notes</p>
                    <p className="text-sm text-foreground-600">{details.usageNotes}</p>
                  </div>
                ) : null}
              </section>
            ) : null}

            <section className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground-500">
                Mechanics
              </h3>
              {details.mechanics.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {details.mechanics.map((mechanic) => (
                    <Chip key={mechanic} size="sm" variant="flat">
                      {mechanic}
                    </Chip>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-foreground-500">
                  No mechanics are attached to this routine.
                </p>
              )}
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground-500">
                Blocks
              </h3>
              {details.blocks.length > 0 ? (
                <div className="space-y-4">
                  {details.blocks.map((block) => (
                    <Card key={block.id} shadow="sm">
                      <CardBody className="space-y-4">
                        <div className="space-y-1">
                          <h4 className="text-base font-semibold">{block.title}</h4>
                          {block.notes ? (
                            <p className="text-sm text-foreground-600">{block.notes}</p>
                          ) : null}
                        </div>

                        {block.drills.length > 0 ? (
                          <div className="grid gap-3 md:grid-cols-2">
                            {block.drills.map((drill, index) => (
                              <div
                                key={`${block.id}:${drill.drillId ?? index}`}
                                className="space-y-3 rounded-md border border-default-200 bg-default-50 p-3"
                              >
                                <div className="space-y-1">
                                  <p className="font-medium">
                                    {drill.title ?? drill.drillId ?? "Untitled drill"}
                                  </p>
                                  {drill.notes ? (
                                    <p className="text-sm text-foreground-600">
                                      {drill.notes}
                                    </p>
                                  ) : null}
                                </div>

                                <Button
                                  size="sm"
                                  variant="flat"
                                  onPress={() =>
                                    openDrill(drill.drillId, drill.title ?? null)
                                  }
                                >
                                  View Drill
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-foreground-500">
                            No drills are attached to this block.
                          </p>
                        )}
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-foreground-500">
                  No blocks are attached to this routine.
                </p>
              )}
            </section>
          </ModalBody>

          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <DrillViewModal
        isOpen={isDrillOpen}
        onClose={() => setIsDrillOpen(false)}
        isLoading={isLoadingDrill}
        error={null}
        drill={selectedDrill}
      />
    </>
  );
}
