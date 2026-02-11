"use client";

import { ReactElement, cloneElement, useMemo, useState } from "react";

import {
  Button,
  Checkbox,
  DatePicker,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { DateValue } from "@internationalized/date";
import { toast } from "sonner";

import { useInjuryTaxonomy } from "@/hooks/injuries/useInjuryTaxonomy";
import { usePlayerInjuries } from "@/hooks/injuries/usePlayerInjuries";
import { useRouteRefetch } from "@/hooks/useRotueRefetch";

type InjuryLevel = "soreness" | "injury" | "diagnosis";
type InjurySide = "left" | "right" | "bilateral" | "none";

interface AddPlayerInjuryModalProps {
  playerId: string;
  trigger: ReactElement<{ onPress?: () => void }>;
}

export function AddPlayerInjuryModal({
  playerId,
  trigger,
}: AddPlayerInjuryModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { refresh } = usePlayerInjuries(playerId);
  const refetch = useRouteRefetch();

  const { bodyParts, focusAreas } = useInjuryTaxonomy();

  const [bodyPartId, setBodyPartId] = useState<string | null>(null);
  const [focusAreaId, setFocusAreaId] = useState<string | null>(null);
  const [side, setSide] = useState<InjurySide>("none");
  const [level, setLevel] = useState<InjuryLevel>("soreness");

  const [useToday, setUseToday] = useState(true);
  const [startDate, setStartDate] = useState<DateValue | null>(null);

  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableFocusAreas = useMemo(() => {
    if (!bodyPartId) return [];
    return focusAreas.filter((fa) => fa.bodyPartId === bodyPartId);
  }, [bodyPartId, focusAreas]);

  const resetState = () => {
    setBodyPartId(null);
    setFocusAreaId(null);
    setSide("none");
    setLevel("soreness");
    setUseToday(true);
    setStartDate(null);
    setNotes("");
  };

  const submit = async () => {
    if (!bodyPartId) return;

    setIsSubmitting(true);

    try {
      const resolvedStartDate = useToday
        ? new Date().toISOString()
        : startDate
          ? new Date(
            Date.UTC(startDate.year, startDate.month - 1, startDate.day)
          ).toISOString()
          : undefined;

      const res = await fetch("/api/injuries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId,
          bodyPartId,
          focusAreaId,
          side,
          level,
          startDate: resolvedStartDate,
          notes,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to log injury");
      }

      resetState();
      refresh();
      refetch();
      onOpenChange();
      toast.success("Injury logged");
    } catch (error) {
      console.error(error);
      toast.error("Failed to log injury");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Trigger */}
      {cloneElement(trigger, {
        onPress: onOpen,
      })}

      {/* Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Log Injury</ModalHeader>

              <ModalBody className="space-y-4">
                {/* Body Part */}
                <Select
                  label="Body Part"
                  selectedKeys={bodyPartId ? [bodyPartId] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setBodyPartId(selected);
                    setFocusAreaId(null);
                  }}
                >
                  {bodyParts.map((part) => (
                    <SelectItem key={part.id}>{part.name}</SelectItem>
                  ))}
                </Select>

                {/* Focus Area (conditional) */}
                {bodyPartId && availableFocusAreas.length > 0 && (
                  <Select
                    label="Specific Area (optional)"
                    selectedKeys={focusAreaId ? [focusAreaId] : []}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      setFocusAreaId(selected);
                    }}
                  >
                    {availableFocusAreas.map((area) => (
                      <SelectItem key={area.id}>{area.name}</SelectItem>
                    ))}
                  </Select>
                )}

                {/* Severity */}
                <Select
                  label="Severity"
                  selectedKeys={[level]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as InjuryLevel;
                    setLevel(selected);
                  }}
                >
                  <SelectItem key="soreness">Soreness / Tightness</SelectItem>
                  <SelectItem key="injury">Injury</SelectItem>
                  <SelectItem key="diagnosis">Diagnosed Injury</SelectItem>
                </Select>

                {/* Side */}
                <Select
                  label="Side"
                  selectedKeys={[side]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as InjurySide;
                    setSide(selected);
                  }}
                >
                  <SelectItem key="none">None</SelectItem>
                  <SelectItem key="left">Left</SelectItem>
                  <SelectItem key="right">Right</SelectItem>
                  <SelectItem key="bilateral">Bilateral</SelectItem>
                </Select>

                {/* Start Date */}
                <div className="space-y-2">
                  <Checkbox isSelected={useToday} onValueChange={setUseToday}>
                    Started today
                  </Checkbox>

                  {!useToday && (
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={setStartDate}
                    />
                  )}
                </div>

                {/* Notes */}
                <Textarea
                  label="Notes"
                  placeholder="Athlete feedback, observed limitations, diagnosis context…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  minRows={4}
                />
              </ModalBody>

              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={() => {
                    resetState();
                    onClose();
                  }}
                  isDisabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={submit}
                  isLoading={isSubmitting}
                  isDisabled={!bodyPartId}
                >
                  Log Injury
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
