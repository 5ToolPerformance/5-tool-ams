"use client";

import {
  Button,
  Checkbox,
  DatePicker,
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
import { CalendarDate, parseDate } from "@internationalized/date";
import { useForm } from "@tanstack/react-form";

import { useCoaches } from "@/hooks";
import { ApiService } from "@/lib/services/api";
import { ApiResponse } from "@/types/api";
import { PlayerInsert, PlayerSelect } from "@/types/database";

interface PlayerCreateFormProps {
  player?: PlayerSelect;
  onPlayerUpdated?: (player: PlayerSelect) => void;
  onPlayerCreated?: (player: PlayerSelect) => void;
}

const formatDateForDB = (calendarDate: CalendarDate) => {
  if (calendarDate instanceof CalendarDate) {
    const year = calendarDate.year;
    const month = String(calendarDate.month).padStart(2, "0");
    const day = String(calendarDate.day).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return calendarDate;
};

const toCalendarDate = (
  value: string | Date | null | undefined
): CalendarDate => {
  if (!value) return parseDate(new Date().toISOString().split("T")[0]);
  if (value instanceof Date) {
    const iso = value.toISOString().split("T")[0];
    return parseDate(iso);
  }
  // assume value is already YYYY-MM-DD
  return parseDate(String(value));
};

export default function PlayerCreateForm({
  player,
  onPlayerUpdated,
  onPlayerCreated,
}: PlayerCreateFormProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { coaches, isLoading: coachesLoading } = useCoaches();
  const isEdit = !!player;

  const form = useForm({
    defaultValues: isEdit
      ? {
        firstName: player?.firstName ?? "",
        lastName: player?.lastName ?? "",
        height: Number(player?.height ?? 0),
        weight: Number(player?.weight ?? 0),
        position: player?.position ?? "",
        throws: player?.throws ?? "",
        hits: player?.hits ?? "",
        prospect: Boolean(player?.prospect ?? false),
        date_of_birth: toCalendarDate(player?.date_of_birth as any),
        sport: player?.sport ?? "baseball",
        primaryCoachId: player?.primaryCoachId ?? "",
      }
      : {
        firstName: "",
        lastName: "",
        height: 0,
        weight: 0,
        position: "",
        throws: "",
        hits: "",
        prospect: false,
        date_of_birth: parseDate(new Date().toISOString().split("T")[0]),
        sport: "baseball",
        primaryCoachId: "",
      },
    onSubmit: async ({ value }) => {
      const formattedValue = {
        ...value,
        date_of_birth: formatDateForDB(value.date_of_birth),
      };
      try {
        if (isEdit && player?.id) {
          const updated = await ApiService.patchPlayerInformationById(
            player.id,
            formattedValue as Partial<PlayerInsert>
          );

          if (onPlayerUpdated && updated) {
            onPlayerUpdated(updated as PlayerSelect);
            onOpenChange();
          }
        } else {
          const response = await fetch("/api/players", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formattedValue),
          });

          const result: ApiResponse<PlayerInsert> = await response.json();

          if (!result.success) {
            throw new Error(result.error || "Failed to create player");
          }

          if (onPlayerCreated && result.data) {
            // The API should return the created player with all required fields
            onPlayerCreated(result.data as PlayerSelect);
            onOpenChange(); // Toggle the modal after successful submission
          }
        }
      } catch (error) {
        console.error("Error saving player:", error);
      }
    },
  });

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        {isEdit ? "Edit Player" : "Create Player"}
      </Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {isEdit ? "Edit Player" : "Create Player"}
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                >
                  <form.Field name="firstName">
                    {(field) => (
                      <Input
                        className="w-full"
                        label="First Name"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    )}
                  </form.Field>
                  <form.Field name="lastName">
                    {(field) => (
                      <Input
                        className="w-full"
                        label="Last Name"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    )}
                  </form.Field>
                  <form.Field name="primaryCoachId">
                    {(field) => (
                      <Select
                        className="w-full"
                        label="Primary Coach"
                        placeholder="Assign a coach"
                        selectedKeys={field.state.value ? [field.state.value] : []}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as string | undefined;
                          field.handleChange(selectedKey ?? "");
                        }}
                        isDisabled={coachesLoading}
                      >
                        {coaches?.map((coach) => (
                          <SelectItem key={coach.id}>
                            {coach.name}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  </form.Field>
                  <form.Field name="height">
                    {(field) => (
                      <Input
                        className="w-full"
                        label="Height (in)"
                        type="number"
                        value={String(field.state.value || "")}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                      />
                    )}
                  </form.Field>
                  <form.Field name="weight">
                    {(field) => (
                      <Input
                        className="w-full"
                        label="Weight (lbs)"
                        type="number"
                        value={String(field.state.value || "")}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                      />
                    )}
                  </form.Field>
                  <form.Field name="position">
                    {(field) => (
                      <Input
                        className="w-full"
                        label="Position"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    )}
                  </form.Field>
                  <form.Field name="throws">
                    {(field) => (
                      <Select
                        className="w-full"
                        label="Throws"
                        placeholder="throws"
                        selectedKeys={
                          field.state.value ? [field.state.value] : []
                        }
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as string;
                          field.handleChange(selectedKey);
                        }}
                        isInvalid={!!field.state.meta.errors.length}
                        errorMessage={field.state.meta.errors.join(", ")}
                        isRequired
                      >
                        <SelectItem key="right">Right</SelectItem>
                        <SelectItem key="left">Left</SelectItem>
                        <SelectItem key="switch">Switch</SelectItem>
                      </Select>
                    )}
                  </form.Field>
                  <form.Field name="hits">
                    {(field) => (
                      <Select
                        className="w-full"
                        label="Hits"
                        placeholder="hits"
                        selectedKeys={
                          field.state.value ? [field.state.value] : []
                        }
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as string;
                          field.handleChange(selectedKey);
                        }}
                        isInvalid={!!field.state.meta.errors.length}
                        errorMessage={field.state.meta.errors.join(", ")}
                        isRequired
                      >
                        <SelectItem key="right">Right</SelectItem>
                        <SelectItem key="left">Left</SelectItem>
                        <SelectItem key="switch">Switch</SelectItem>
                      </Select>
                    )}
                  </form.Field>
                  <form.Field name="date_of_birth">
                    {(field) => (
                      <DatePicker
                        className="w-full"
                        label="Date of Birth"
                        showMonthAndYearPickers
                        value={
                          field.state.value instanceof CalendarDate
                            ? field.state.value
                            : undefined
                        }
                        onChange={(value) => {
                          if (value) {
                            field.handleChange(value);
                          } else {
                            field.handleChange(new CalendarDate(2000, 1, 1));
                          }
                        }}
                      />
                    )}
                  </form.Field>
                  <form.Field name="prospect">
                    {(field) => (
                      <Checkbox
                        className="py-1"
                        isSelected={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        Prospect
                      </Checkbox>
                    )}
                  </form.Field>
                  <form.Field name="sport">
                    {(field) => (
                      <Select
                        className="w-full"
                        label="Sport"
                        placeholder="sport"
                        selectedKeys={
                          field.state.value ? [field.state.value] : []
                        }
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as string;
                          field.handleChange(selectedKey);
                        }}
                        isInvalid={!!field.state.meta.errors.length}
                        errorMessage={field.state.meta.errors.join(", ")}
                        isRequired
                      >
                        <SelectItem key="baseball">Baseball</SelectItem>
                        <SelectItem key="softball">Softball</SelectItem>
                      </Select>
                    )}
                  </form.Field>
                  <Button type="submit" color="primary" className="w-full">
                    {isEdit ? "Update Player" : "Save Player"}
                  </Button>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
