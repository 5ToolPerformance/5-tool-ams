"use client";

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
import { CalendarDate, parseDate } from "@internationalized/date";
import { useForm } from "@tanstack/react-form";

import { ApiResponse } from "@/types/api";
import { PlayerInsert, PlayerSelect } from "@/types/database";

interface PlayerCreateFormProps {
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

export default function PlayerCreateForm({
  onPlayerCreated,
}: PlayerCreateFormProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      height: 0,
      weight: 0,
      position: "",
      throws: "",
      hits: "",
      date_of_birth: parseDate(new Date().toISOString().split("T")[0]),
    },
    onSubmit: async ({ value }) => {
      const formattedValue = {
        ...value,
        date_of_birth: formatDateForDB(value.date_of_birth),
      };
      try {
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
      } catch (error) {
        console.error("Error creating player:", error);
      }
    },
  });

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        Create Player
      </Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Player
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                >
                  <form.Field name="firstName">
                    {(field) => (
                      <Input
                        label="First Name"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    )}
                  </form.Field>
                  <form.Field name="lastName">
                    {(field) => (
                      <Input
                        label="Last Name"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    )}
                  </form.Field>
                  <form.Field name="height">
                    {(field) => (
                      <Input
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
                        label="Position"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    )}
                  </form.Field>
                  <form.Field name="throws">
                    {(field) => (
                      <Select
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
                      <Input
                        type="date"
                        label="Date of Birth"
                        value={
                          field.state.value instanceof CalendarDate
                            ? `${field.state.value.year}-${String(field.state.value.month).padStart(2, "0")}-${String(field.state.value.day).padStart(2, "0")}`
                            : field.state.value || ""
                        }
                        onChange={(e) => {
                          if (e.target.value) {
                            const [year, month, day] = e.target.value
                              .split("-")
                              .map(Number);
                            field.handleChange(
                              new CalendarDate(year, month, day)
                            );
                          } else {
                            field.handleChange(new CalendarDate(2000, 1, 1));
                          }
                        }}
                      />
                    )}
                  </form.Field>
                  <Button type="submit" color="primary">
                    Save Player
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
