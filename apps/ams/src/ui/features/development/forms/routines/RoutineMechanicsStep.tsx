"use client";

import { Button, Card, CardBody, CardHeader, Select, SelectItem } from "@heroui/react";

import { useRoutineFormContext } from "./RoutineFormProvider";

export function RoutineMechanicsStep() {
  const {
    values,
    errors,
    availableMechanicOptions,
    addMechanic,
    updateMechanic,
    removeMechanic,
  } = useRoutineFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Mechanics</h3>
        <p className="text-sm text-default-500">
          Select the mechanics this routine is intended to address.
        </p>
      </CardHeader>

      <CardBody className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Mechanic List</p>
            <p className="text-xs text-default-500">
              At least one mechanic is required.
            </p>
          </div>

          <Button size="sm" variant="flat" onPress={addMechanic}>
            Add Mechanic
          </Button>
        </div>

        {errors.mechanics ? (
          <p className="text-sm text-danger">{errors.mechanics}</p>
        ) : null}

        {availableMechanicOptions.length === 0 ? (
          <div className="rounded-medium border border-dashed px-4 py-6 text-sm text-default-500">
            No mechanics are available for the selected plan discipline.
          </div>
        ) : null}

        {values.mechanics.length === 0 ? (
          <div className="rounded-medium border border-dashed px-4 py-6 text-sm text-default-500">
            No mechanics added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {values.mechanics.map((mechanic, index) => (
              <Card key={mechanic.id} shadow="none" className="border">
                <CardBody className="gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">Mechanic {index + 1}</p>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => removeMechanic(index)}
                    >
                      Remove
                    </Button>
                  </div>

                  <Select
                    label="Mechanic"
                    labelPlacement="outside"
                    placeholder="Select a mechanic"
                    selectedKeys={mechanic.mechanicId ? [mechanic.mechanicId] : []}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0];
                      if (typeof selected === "string") {
                        const option = availableMechanicOptions.find(
                          (item) => item.id === selected
                        );
                        updateMechanic(index, {
                          mechanicId: selected,
                          title: option?.name ?? "",
                        });
                      }
                    }}
                    isInvalid={!!errors[`mechanics.${index}.mechanicId`]}
                    errorMessage={errors[`mechanics.${index}.mechanicId`]}
                  >
                    {availableMechanicOptions.map((option) => (
                      <SelectItem key={option.id}>{option.name}</SelectItem>
                    ))}
                  </Select>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
