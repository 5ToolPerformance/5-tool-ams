"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
} from "@heroui/react";

import { useEvaluationFormContext } from "./EvaluationFormProvider";

export function EvaluationFocusAreasStep() {
  const { values, errors, addFocusArea, updateFocusArea, removeFocusArea } =
    useEvaluationFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Focus Areas</h3>
        <p className="text-sm text-default-500">
          Define the top 1–3 highest-impact priorities right now.
        </p>
      </CardHeader>

      <CardBody className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Priority Focus Areas</p>
            <p className="text-xs text-default-500">
              Keep this list small and actionable.
            </p>
          </div>

          <Button
            size="sm"
            variant="flat"
            onPress={addFocusArea}
            isDisabled={values.focusAreas.length >= 3}
          >
            Add Focus Area
          </Button>
        </div>

        {errors.focusAreas ? (
          <p className="text-sm text-danger">{errors.focusAreas}</p>
        ) : null}

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
                    placeholder="e.g. Improve lead leg stability"
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
