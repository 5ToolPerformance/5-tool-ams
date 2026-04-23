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
import { CalendarDate, today } from "@internationalized/date";
import { toast } from "sonner";

import { useAllPositions, useCoaches } from "@/hooks";

interface CreatePlayerConfigModalProps {
  trigger: React.ReactElement<{ onPress?: () => void }>;
  onSuccess?: () => void;
}

export function CreatePlayerConfigModal({
  trigger,
  onSuccess,
}: CreatePlayerConfigModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  /* ---------- data ---------- */

  const { coaches, isLoading: coachesLoading } = useCoaches();
  const { positions, isLoading: positionsLoading } = useAllPositions();

  /* ---------- identity state ---------- */

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState<CalendarDate>(today("UTC"));
  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [sport, setSport] = useState<"baseball" | "softball">("baseball");

  const [throwsHand, setThrowsHand] = useState<
    "right" | "left" | "switch" | null
  >(null);

  const [hitsHand, setHitsHand] = useState<"right" | "left" | "switch" | null>(
    null
  );

  /* ---------- relationships ---------- */

  const [primaryCoachId, setPrimaryCoachId] = useState<string | null>(null);
  const [primaryPositionId, setPrimaryPositionId] = useState<string | null>(
    null
  );
  const [secondaryPositionIds, setSecondaryPositionIds] = useState<string[]>(
    []
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------- derived ---------- */

  const secondaryOptions = useMemo(() => {
    return positions.filter((p) => p.id !== primaryPositionId);
  }, [positions, primaryPositionId]);

  /* ---------- submit ---------- */

  const submit = async () => {
    if (!firstName || !lastName) {
      toast.error("First and last name are required");
      return;
    }

    if (!primaryPositionId) {
      toast.error("Primary position is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // identity
          firstName,
          lastName,
          date_of_birth: dob.toString(), // YYYY-MM-DD
          sport,

          // physicals
          height,
          weight,

          // handedness
          throws: throwsHand,
          hits: hitsHand,

          // relationships
          primaryCoachId,
          primaryPositionId,
          secondaryPositionIds,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create player");
      }

      toast.success("Player created successfully");
      onSuccess?.();
      onOpenChange();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create player");
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
              <ModalHeader>Create Player</ModalHeader>

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
                        return p ? p.code : null;
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
                  Create Player
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
