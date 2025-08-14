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
      prospect: false,
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
                  <Button type="submit" color="primary" className="w-full">
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
