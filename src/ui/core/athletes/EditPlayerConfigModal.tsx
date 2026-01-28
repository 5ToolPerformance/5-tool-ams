"use client";

import { cloneElement, useMemo, useState } from "react";

import { DatePicker } from "@heroui/date-picker";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
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

  /* ---------- identity state ---------- */

  const [firstName, setFirstName] = useState(player.firstName);
  const [lastName, setLastName] = useState(player.lastName);
  const [dob, setDob] = useState(parseDate(player.dob));
  const [height, setHeight] = useState<number | null>(player.height);
  const [weight, setWeight] = useState<number | null>(player.weight);
  const [sport, setSport] = useState<"baseball" | "softball">(player.sport);
  const [throwsHand, setThrowsHand] = useState<
    "right" | "left" | "switch" | null
  >(player.handedness.throw);

  const [hitsHand, setHitsHand] = useState<"right" | "left" | "switch" | null>(
    player.handedness.bat
  );

  /* ---------- relationships ---------- */

  const primaryPosition = player.positions.find((p) => p.isPrimary) ?? null;
  const secondaryPositions = player.positions.filter((p) => !p.isPrimary);

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

  /* ---------- derived ---------- */

  const secondaryOptions = useMemo(() => {
    return positions.filter((p) => p.id !== primaryPositionId);
  }, [positions, primaryPositionId]);

  /* ---------- submit ---------- */

  const submit = async () => {
    if (!primaryPositionId) {
      toast.error("Primary position is required");
      return;
    }

    setIsSubmitting(true);

    try {
      /* ---- update core player ---- */
      await fetch(`/api/players/${player.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          date_of_birth: dob.toString(), // YYYY-MM-DD
          height,
          weight,
          sport,
          primaryCoachId,
          throws: throwsHand,
          hits: hitsHand,
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

      toast.success("Player updated successfully");
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
              <ModalHeader>Edit Player</ModalHeader>

              <ModalBody className="space-y-6">
                {/* Identity */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <Input
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />

                  <DatePicker
                    label="Date of Birth"
                    value={dob}
                    onChange={(v) => v && setDob(v)}
                  />

                  <Select
                    label="Sport"
                    selectedKeys={[sport]}
                    onSelectionChange={(keys) =>
                      setSport(Array.from(keys)[0] as "baseball" | "softball")
                    }
                  >
                    <SelectItem key="baseball">Baseball</SelectItem>
                    <SelectItem key="softball">Softball</SelectItem>
                  </Select>

                  <Input
                    type="number"
                    label="Height (in)"
                    value={height?.toString() ?? ""}
                    onChange={(e) =>
                      setHeight(e.target.value ? Number(e.target.value) : null)
                    }
                  />

                  <Input
                    type="number"
                    label="Weight (lbs)"
                    value={weight?.toString() ?? ""}
                    onChange={(e) =>
                      setWeight(e.target.value ? Number(e.target.value) : null)
                    }
                  />

                  <Select
                    label="Throws"
                    selectedKeys={throwsHand ? [throwsHand] : []}
                    onSelectionChange={(keys) =>
                      setThrowsHand(
                        Array.from(keys)[0] as "right" | "left" | "switch"
                      )
                    }
                  >
                    <SelectItem key="right">Right</SelectItem>
                    <SelectItem key="left">Left</SelectItem>
                    <SelectItem key="switch">Switch</SelectItem>
                  </Select>

                  <Select
                    label="Hits"
                    selectedKeys={hitsHand ? [hitsHand] : []}
                    onSelectionChange={(keys) =>
                      setHitsHand(
                        Array.from(keys)[0] as "right" | "left" | "switch"
                      )
                    }
                  >
                    <SelectItem key="right">Right</SelectItem>
                    <SelectItem key="left">Left</SelectItem>
                    <SelectItem key="switch">Switch</SelectItem>
                  </Select>
                </div>

                {/* Coach */}
                <Select
                  label="Primary Coach"
                  selectedKeys={primaryCoachId ? [primaryCoachId] : []}
                  isDisabled={coachesLoading}
                  onSelectionChange={(keys) =>
                    setPrimaryCoachId((Array.from(keys)[0] as string) ?? null)
                  }
                >
                  {coaches.map((c) => (
                    <SelectItem key={c.id}>{c.name}</SelectItem>
                  ))}
                </Select>

                {/* Positions */}
                <Select
                  label="Primary Position"
                  isRequired
                  selectedKeys={primaryPositionId ? [primaryPositionId] : []}
                  isDisabled={positionsLoading}
                  renderValue={(items) =>
                    items
                      .map((i) => {
                        const p = positions.find((p) => p.id === i.key);
                        return p ? `${p.code}` : null;
                      })
                      .filter(Boolean)
                      .join(", ")
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

                <Select
                  label="Secondary Positions"
                  selectionMode="multiple"
                  selectedKeys={new Set(secondaryPositionIds)}
                  isDisabled={!primaryPositionId}
                  renderValue={(items) =>
                    items
                      .map((i) => {
                        const p = positions.find((p) => p.id === i.key);
                        return p ? p.code : null;
                      })
                      .filter(Boolean)
                      .join(", ")
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
