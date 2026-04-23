"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

type RoutineOption = {
  id: string;
  title: string;
  routineType: string;
};

interface DevelopmentReportOptionsModalProps {
  isOpen: boolean;
  playerName: string;
  routines: RoutineOption[];
  onClose: () => void;
  onPreview: (options: { routineIds: string[] }) => void;
}

export function DevelopmentReportOptionsModal({
  isOpen,
  playerName,
  routines,
  onClose,
  onPreview,
}: DevelopmentReportOptionsModalProps) {
  const [selectedRoutineIds, setSelectedRoutineIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedRoutineIds([]);
    }
  }, [isOpen]);

  const selectedRoutineIdSet = useMemo(
    () => new Set(selectedRoutineIds),
    [selectedRoutineIds]
  );

  function toggleRoutine(routineId: string, isSelected: boolean) {
    setSelectedRoutineIds((current) => {
      if (isSelected) {
        return current.includes(routineId) ? current : [...current, routineId];
      }

      return current.filter((id) => id !== routineId);
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent>
        <ModalHeader>Export Routine PDF</ModalHeader>
        <ModalBody className="space-y-5">
          <div className="space-y-1">
            <p className="text-sm font-medium">Routine packet for {playerName}</p>
            <p className="text-sm text-muted-foreground">
              Select the player-specific routines to include before opening the printable PDF.
            </p>
          </div>

          {routines.length > 0 ? (
            <div className="space-y-3 rounded-lg border border-default-200 p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Included routines</p>
                <p className="text-sm text-muted-foreground">
                  Choose one or more routines to print for the coach packet.
                </p>
              </div>

              <div className="space-y-3">
                {routines.map((routine) => (
                  <div
                    key={routine.id}
                    className="rounded-md border border-default-100 px-3 py-2"
                  >
                    <Checkbox
                      isSelected={selectedRoutineIdSet.has(routine.id)}
                      onValueChange={(isSelected) =>
                        toggleRoutine(routine.id, isSelected)
                      }
                    >
                      <span className="font-medium">{routine.title}</span>
                      <span className="ml-2 text-xs uppercase tracking-wide text-muted-foreground">
                        {routine.routineType.replaceAll("_", " ")}
                      </span>
                    </Checkbox>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={() => onPreview({ routineIds: selectedRoutineIds })}
            isDisabled={selectedRoutineIds.length === 0}
          >
            Open PDF
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
