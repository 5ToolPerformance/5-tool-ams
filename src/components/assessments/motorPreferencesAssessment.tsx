import {
  Button,
  Checkbox,
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
import {
  Archetype,
  MotorPreferencesForm,
  leftRight,
} from "@/types/assessments";

export default function MotorPreferencesModal({
  playerId,
  coachId,
}: {
  playerId: string | null;
  coachId: string | undefined;
}) {
  const form = useForm({
    defaultValues: {
      playerId: playerId,
      coachId: coachId,
      assessmentDate: new Date().toISOString().split("T")[0],
      archetype: "aerial" as Archetype, // or "terrestrial"
      breath: false,
      extensionLeg: "left" as leftRight, // or "right" | "switch"
      association: false,
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value);
      try {
        const response = await fetch(
          `/api/players/${playerId}/motor-preference`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(value),
          }
        );

        const result: ApiResponse<MotorPreferencesForm> = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to create motor preference");
        }
      } catch (error) {
        console.error("Error creating motor preference:", error);
      }
    },
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        Create MPE
      </Button>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Motor Preferences
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
                  <form.Field name="archetype">
                    {(field) => (
                      <Select
                        className="w-full"
                        label="Archetype"
                        selectedKeys={
                          field.state.value ? [field.state.value] : []
                        }
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as Archetype;
                          field.handleChange(selectedKey);
                        }}
                      >
                        <SelectItem key="aerial">Aerial</SelectItem>
                        <SelectItem key="terrestrial">Terrestrial</SelectItem>
                      </Select>
                    )}
                  </form.Field>

                  <form.Field name="breath">
                    {(field) => (
                      <Checkbox
                        className="py-1"
                        isSelected={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        Breath In
                      </Checkbox>
                    )}
                  </form.Field>

                  <form.Field name="extensionLeg">
                    {(field) => (
                      <Select
                        className="w-full"
                        label="Extension Leg"
                        selectedKeys={
                          field.state.value ? [field.state.value] : []
                        }
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as leftRight;
                          field.handleChange(selectedKey);
                        }}
                      >
                        <SelectItem key="left">Left</SelectItem>
                        <SelectItem key="right">Right</SelectItem>
                        <SelectItem key="switch">Switch</SelectItem>
                      </Select>
                    )}
                  </form.Field>

                  <form.Field name="association">
                    {(field) => (
                      <Checkbox
                        className="py-1"
                        isSelected={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        Associated
                      </Checkbox>
                    )}
                  </form.Field>

                  <form.Field name="assessmentDate">
                    {(field) => (
                      <Input
                        className="w-full"
                        type="date"
                        label="Assessment Date"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    )}
                  </form.Field>

                  <Button type="submit" color="primary" className="w-full">
                    Save Preferences
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
