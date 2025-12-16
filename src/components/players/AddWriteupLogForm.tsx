"use client";

import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { usePlayerWriteups } from "@/hooks";

interface AddWriteupFormProps {
  playerId: string;
  onSuccess?: () => void;
}

const WRITEUP_TYPES = [
  { value: "mid_package", label: "Mid Package" },
  { value: "end_package", label: "End Package" },
  { value: "end_of_year", label: "End of Year" },
] as const;

interface WriteupFormData {
  writeupType: "mid_package" | "end_package" | "end_of_year" | "";
  writeupDate: string;
  notes: string;
}

export function AddWriteupForm({ playerId, onSuccess }: AddWriteupFormProps) {
  const { addWriteup } = usePlayerWriteups(playerId);

  const form = useForm({
    defaultValues: {
      writeupType: "",
      writeupDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
    onSubmit: async ({ value }) => {
      if (!value.writeupType) {
        toast.error("Please select a writeup type");
        return;
      }

      try {
        await addWriteup({
          writeupType: value.writeupType as
            | "mid_package"
            | "end_package"
            | "end_of_year",
          writeupDate: value.writeupDate,
          notes: value.notes || undefined,
        });
        toast.success("Writeup added successfully");

        // Reset form
        form.reset();

        onSuccess?.();
      } catch (error) {
        toast.error("Failed to add writeup");
        console.error(error);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field name="writeupType">
        {(field) => (
          <Select
            label="Writeup Type"
            placeholder="Select writeup type"
            selectedKeys={field.state.value ? [field.state.value] : []}
            onChange={(e) =>
              field.handleChange(
                e.target.value as WriteupFormData["writeupType"]
              )
            }
            isRequired
            errorMessage={field.state.meta.errors?.[0]}
            isInvalid={field.state.meta.errors.length > 0}
          >
            {WRITEUP_TYPES.map((type) => (
              <SelectItem key={type.value}>{type.label}</SelectItem>
            ))}
          </Select>
        )}
      </form.Field>

      <form.Field name="writeupDate">
        {(field) => (
          <Input
            type="date"
            label="Date"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            isRequired
            errorMessage={field.state.meta.errors?.[0]}
            isInvalid={field.state.meta.errors.length > 0}
          />
        )}
      </form.Field>

      <form.Field name="notes">
        {(field) => (
          <Textarea
            label="Notes (Optional)"
            placeholder="Add any additional notes..."
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>

      <Button
        type="submit"
        color="primary"
        isLoading={form.state.isSubmitting}
        fullWidth
      >
        Add Writeup
      </Button>
    </form>
  );
}
