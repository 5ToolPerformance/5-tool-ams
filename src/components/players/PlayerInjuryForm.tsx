import {
  Button,
  CalendarDate,
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
import { useForm } from "@tanstack/react-form";

import { ApiResponse } from "@/types/api";
import { PlayerInjuryInsert } from "@/types/database";

export default function PlayerInjuryModal({
  playerId,
}: {
  playerId: string | null;
}) {
  const form = useForm({
    defaultValues: {
      playerId: playerId,
      injuryDate: new Date().toISOString().split("T")[0],
      injury: "",
      status: "active",
      severity: "unknown",
      description: "",
      notes: "",
      created_at: new Date().toISOString().split("T")[0],
      updated_at: new Date().toISOString().split("T")[0],
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value);
      try {
        const response = await fetch(`/api/players/${playerId}/injury`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        });

        const result: ApiResponse<PlayerInjuryInsert> = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to create injury");
        }
      } catch (error) {
        console.error("Error creating injury:", error);
      }
    },
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button color="danger" onPress={onOpen}>
        Log Injury
      </Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Log Injury
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                      await form.handleSubmit();
                      form.reset();
                      onClose();
                      alert("Injury saved");
                    } catch (error) {
                      // Submission failed; keep modal open and do not show success alert
                    }
                  }}
                >
                  <form.Field name="injury">
                    {(field) => (
                      <Input
                        className="w-full"
                        type="text"
                        label="Injury"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    )}
                  </form.Field>
                  <form.Field name="status">
                    {(field) => (
                      <Select
                        className="w-full"
                        label="Status"
                        selectedKeys={
                          field.state.value ? [field.state.value] : []
                        }
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as string;
                          field.handleChange(selectedKey);
                        }}
                      >
                        <SelectItem key="active">Active</SelectItem>
                        <SelectItem key="inactive">Resolved</SelectItem>
                        <SelectItem key="recurring">Recurring</SelectItem>
                        <SelectItem key="monitoring">Monitoring</SelectItem>
                      </Select>
                    )}
                  </form.Field>

                  <form.Field name="severity">
                    {(field) => (
                      <Select
                        className="w-full"
                        label="Severity"
                        selectedKeys={
                          field.state.value ? [field.state.value] : []
                        }
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as string;
                          field.handleChange(selectedKey);
                        }}
                      >
                        <SelectItem key="minor">Minor</SelectItem>
                        <SelectItem key="moderate">Moderate</SelectItem>
                        <SelectItem key="severe">Severe</SelectItem>
                        <SelectItem key="unknown">Unknown</SelectItem>
                      </Select>
                    )}
                  </form.Field>
                  <form.Field name="description">
                    {(field) => (
                      <Input
                        className="w-full"
                        type="text"
                        label="Description"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    )}
                  </form.Field>
                  <form.Field name="notes">
                    {(field) => (
                      <Input
                        className="w-full"
                        type="text"
                        label="Notes"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    )}
                  </form.Field>
                  <form.Field name="injuryDate">
                    {(field) => (
                      <DatePicker
                        label="Lesson Date"
                        showMonthAndYearPickers
                        value={((): CalendarDate | undefined => {
                          const v = field.state.value as string | undefined;
                          if (!v) return undefined;
                          // Expecting YYYY-MM-DD
                          const match = /^\d{4}-\d{2}-\d{2}$/.test(v);
                          if (!match) return undefined;
                          const [y, m, d] = v.split("-").map(Number);
                          try {
                            return new CalendarDate(y, m, d);
                          } catch {
                            return undefined;
                          }
                        })()}
                        onChange={(value) => {
                          if (value) {
                            const yyyy = String(value.year).padStart(4, "0");
                            const mm = String(value.month).padStart(2, "0");
                            const dd = String(value.day).padStart(2, "0");
                            field.handleChange(`${yyyy}-${mm}-${dd}`);
                          } else {
                            field.handleChange("");
                          }
                        }}
                        isRequired
                      />
                    )}
                  </form.Field>
                  <Button type="submit" color="primary" className="w-full">
                    Save Injury
                  </Button>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="flat" onPress={onClose}>
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
