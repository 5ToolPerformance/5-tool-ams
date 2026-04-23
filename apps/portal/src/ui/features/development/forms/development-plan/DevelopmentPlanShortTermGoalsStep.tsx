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

export function DevelopmentPlanShortTermGoalsStep() {
  const {
    values,
    errors,
    addShortTermGoal,
    updateShortTermGoal,
    removeShortTermGoal,
  } = useDevelopmentPlanFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Short-Term Goals</h3>
        <p className="text-sm text-default-500">
          Add 4-6 week goals aligned with the current development focus.
        </p>
      </CardHeader>

      <CardBody className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Short-Term Goal List</p>
            <p className="text-xs text-default-500">
              Add concise, actionable goals.
            </p>
          </div>

          <Button size="sm" variant="flat" onPress={addShortTermGoal}>
            Add Goal
          </Button>
        </div>

        {values.shortTermGoals.length === 0 ? (
          <div className="rounded-medium border border-dashed px-4 py-6 text-sm text-default-500">
            No short-term goals added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {values.shortTermGoals.map((goal, index) => (
              <Card key={goal.id} shadow="none" className="border">
                <CardBody className="gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">
                      Short-Term Goal {index + 1}
                    </p>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => removeShortTermGoal(index)}
                    >
                      Remove
                    </Button>
                  </div>

                  <Input
                    label="Title"
                    labelPlacement="outside"
                    value={goal.title}
                    onValueChange={(value) =>
                      updateShortTermGoal(index, { title: value })
                    }
                    placeholder="e.g. Improve strike zone command consistency"
                    isInvalid={!!errors[`shortTermGoals.${index}.title`]}
                    errorMessage={errors[`shortTermGoals.${index}.title`]}
                  />

                  <Textarea
                    label="Description"
                    labelPlacement="outside"
                    value={goal.description}
                    onValueChange={(value) =>
                      updateShortTermGoal(index, { description: value })
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
