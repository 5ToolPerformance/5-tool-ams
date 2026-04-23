"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
} from "@heroui/react";

import { useDevelopmentPlanFormContext } from "./DevelopmentPlanFormProvider";

export function DevelopmentPlanLongTermGoalsStep() {
  const {
    values,
    errors,
    addLongTermGoal,
    updateLongTermGoal,
    removeLongTermGoal,
  } = useDevelopmentPlanFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Long-Term Goals</h3>
        <p className="text-sm text-default-500">
          Add bigger directional goals for the season or year.
        </p>
      </CardHeader>

      <CardBody className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Long-Term Goal List</p>
            <p className="text-xs text-default-500">
              Add directional outcomes that guide development.
            </p>
          </div>

          <Button size="sm" variant="flat" onPress={addLongTermGoal}>
            Add Goal
          </Button>
        </div>

        {values.longTermGoals.length === 0 ? (
          <div className="rounded-medium border border-dashed px-4 py-6 text-sm text-default-500">
            No long-term goals added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {values.longTermGoals.map((goal, index) => (
              <Card key={goal.id} shadow="none" className="border">
                <CardBody className="gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">
                      Long-Term Goal {index + 1}
                    </p>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => removeLongTermGoal(index)}
                    >
                      Remove
                    </Button>
                  </div>

                  <Input
                    label="Title"
                    labelPlacement="outside"
                    value={goal.title}
                    onValueChange={(value) =>
                      updateLongTermGoal(index, { title: value })
                    }
                    placeholder="e.g. Build durable starter profile"
                    isInvalid={!!errors[`longTermGoals.${index}.title`]}
                    errorMessage={errors[`longTermGoals.${index}.title`]}
                  />

                  <Textarea
                    label="Description"
                    labelPlacement="outside"
                    value={goal.description}
                    onValueChange={(value) =>
                      updateLongTermGoal(index, { description: value })
                    }
                    placeholder="Optional coaching context"
                    minRows={3}
                  />
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
