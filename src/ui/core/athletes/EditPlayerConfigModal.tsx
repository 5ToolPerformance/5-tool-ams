"use client";

import { cloneElement, useMemo, useState } from "react";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { toast } from "sonner";

import { PlayerHeaderModel } from "@/domain/player/header/types";
import { useAllPositions, useCoaches } from "@/hooks";

interface EditPlayerConfigModalProps {
  player: PlayerHeaderModel;
  trigger: React.ReactElement<{ onPress?: () => void }>;
  onSuccess?: () => void;
}

export function EditPlayerConfigModal({
  player,
  trigger,
  onSuccess,
}: EditPlayerConfigModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  /* ---------- data ---------- */

  const { coaches, isLoading: coachesLoading } = useCoaches();
  const { positions, isLoading: positionsLoading } = useAllPositions();

  /* ---------- derived defaults ---------- */

  const primaryPosition = player.positions.find((p) => p.isPrimary) ?? null;
  const secondaryPositions = player.positions.filter((p) => !p.isPrimary);

  /* ---------- local state ---------- */

  const [primaryCoachId, setPrimaryCoachId] = useState<string | null>(
    player.primaryCoachId
  );

  const [primaryPositionId, setPrimaryPositionId] = useState<string | null>(
    primaryPosition?.id ?? null
  );

  const [secondaryPositionIds, setSecondaryPositionIds] = useState<string[]>(
    secondaryPositions.map((p) => p.id)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------- filtered options ---------- */

  const secondaryOptions = useMemo(() => {
    return positions?.filter((p) => p.id !== primaryPositionId) ?? [];
  }, [positions, primaryPositionId]);

  /* ---------- submit ---------- */

  const submit = async () => {
    if (!primaryPositionId) {
      toast.error("Primary position is required");
      return;
    }

    setIsSubmitting(true);

    try {
      /* ---- update primary coach ---- */
      await fetch(`/api/players/${player.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primaryCoachId,
        }),
      });

      /* ---- update positions ---- */
      await fetch(`/api/players/${player.id}/positions`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primaryPositionId,
          secondaryPositionIds,
        }),
      });

      toast.success("Player configuration updated");
      onSuccess?.();
      onOpenChange();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update player");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- render ---------- */

  return (
    <>
      {cloneElement(trigger, { onPress: onOpen })}

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Player Configuration</ModalHeader>

              <ModalBody className="space-y-5">
                {/* Primary Coach */}
                <Select
                  label="Primary Coach"
                  selectedKeys={primaryCoachId ? [primaryCoachId] : []}
                  isDisabled={coachesLoading}
                  onSelectionChange={(keys) =>
                    setPrimaryCoachId((Array.from(keys)[0] as string) ?? null)
                  }
                >
                  {coaches?.map((coach) => (
                    <SelectItem key={coach.id}>{coach.name}</SelectItem>
                  ))}
                </Select>

                {/* Primary Position */}
                <Select
                  label="Primary Position"
                  isRequired
                  selectedKeys={primaryPositionId ? [primaryPositionId] : []}
                  isDisabled={positionsLoading}
                  renderValue={(items) =>
                    items.map((item) => {
                      const pos = positions.find((p) => p.id === item.key);
                      return pos ? `${pos.code} — ${pos.name}` : "";
                    })
                  }
                  onSelectionChange={(keys) => {
                    const id = Array.from(keys)[0] as string;
                    setPrimaryPositionId(id);
                    setSecondaryPositionIds((prev) =>
                      prev.filter((p) => p !== id)
                    );
                  }}
                >
                  {positions.map((p) => (
                    <SelectItem key={p.id}>
                      {p.code} — {p.name}
                    </SelectItem>
                  ))}
                </Select>

                {/* Secondary Positions */}
                <Select
                  label="Secondary Positions"
                  selectionMode="multiple"
                  selectedKeys={new Set(secondaryPositionIds)}
                  isDisabled={positionsLoading || !primaryPositionId}
                  renderValue={(items) =>
                    items.map((item) => {
                      const pos = positions.find((p) => p.id === item.key);
                      return pos ? `${pos.code} — ${pos.name}` : "";
                    })
                  }
                  onSelectionChange={(keys) =>
                    setSecondaryPositionIds(Array.from(keys) as string[])
                  }
                >
                  {secondaryOptions.map((p) => (
                    <SelectItem key={p.id}>
                      {p.code} — {p.name}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>

              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={isSubmitting}
                  onPress={submit}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
