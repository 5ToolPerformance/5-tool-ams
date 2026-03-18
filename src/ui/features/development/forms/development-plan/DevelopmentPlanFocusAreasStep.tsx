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

export function DevelopmentPlanFocusAreasStep() {
  const { values, errors, addFocusArea, updateFocusArea, removeFocusArea } =
    useDevelopmentPlanFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Focus Areas</h3>
        <p className="text-sm text-default-500">
          Define the top development priorities this plan is built around.
        </p>
      </CardHeader>

      <CardBody className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Plan Focus Areas</p>
            <p className="text-xs text-default-500">
              Keep these aligned to the athlete&apos;s current needs.
            </p>
          </div>

          <Button size="sm" variant="flat" onPress={addFocusArea}>
            Add Focus Area
          </Button>
        </div>

        {values.focusAreas.length === 0 ? (
          <div className="rounded-medium border border-dashed px-4 py-6 text-sm text-default-500">
            No focus areas added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {values.focusAreas.map((focusArea, index) => (
              <Card key={focusArea.id} shadow="none" className="border">
                <CardBody className="gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">
                      Focus Area {index + 1}
                    </p>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => removeFocusArea(index)}
                    >
                      Remove
                    </Button>
                  </div>

                  <Input
                    label="Title"
                    labelPlacement="outside"
                    value={focusArea.title}
                    onValueChange={(value) =>
                      updateFocusArea(index, { title: value })
                    }
                    placeholder="e.g. Improve lower-half direction"
                    isInvalid={!!errors[`focusAreas.${index}.title`]}
                    errorMessage={errors[`focusAreas.${index}.title`]}
                  />

                  <Textarea
                    label="Description"
                    labelPlacement="outside"
                    value={focusArea.description}
                    onValueChange={(value) =>
                      updateFocusArea(index, { description: value })
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
