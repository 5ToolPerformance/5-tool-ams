"use client";

import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { useForm } from "react-hook-form";

type FormValues = {
  name: string;
  description?: string;
  type: "pitching" | "hitting" | "fielding" | "catching" | "strength";
  tags?: string;
};

const TYPES: FormValues["type"][] = [
  "pitching",
  "hitting",
  "fielding",
  "catching",
  "strength",
];

export function MechanicForm({
  initialValues,
  onSuccess,
}: {
  initialValues?: any;
  onSuccess: () => void;
}) {
  const form = useForm<FormValues>({
    defaultValues: {
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      type: initialValues?.type ?? "hitting",
      tags: initialValues?.tags?.join(", ") ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    const payload = {
      name: values.name,
      description: values.description,
      type: values.type,
      tags: values.tags ? values.tags.split(",").map((t) => t.trim()) : [],
    };

    await fetch(
      initialValues ? `/api/mechanics/${initialValues.id}` : "/api/mechanics",
      {
        method: initialValues ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    onSuccess();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Name" isRequired {...form.register("name")} />

      <Textarea label="Description" {...form.register("description")} />

      <Select
        label="Type"
        selectedKeys={[form.watch("type")]}
        onSelectionChange={(keys) =>
          form.setValue("type", [...keys][0] as FormValues["type"])
        }
      >
        {TYPES.map((type) => (
          <SelectItem key={type} textValue={type}>
            {type}
          </SelectItem>
        ))}
      </Select>

      <Input
        label="Tags"
        description="Comma-separated"
        {...form.register("tags")}
      />

      <Button color="primary" type="submit" fullWidth>
        Save Mechanic
      </Button>
    </form>
  );
}
