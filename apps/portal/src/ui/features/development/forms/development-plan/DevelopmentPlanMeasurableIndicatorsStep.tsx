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

export function DevelopmentPlanMeasurableIndicatorsStep() {
  const {
    values,
    errors,
    addMeasurableIndicator,
    updateMeasurableIndicator,
    removeMeasurableIndicator,
  } = useDevelopmentPlanFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Measurable Indicators</h3>
        <p className="text-sm text-default-500">
          Add metrics or behavior markers that support the plan.
        </p>
      </CardHeader>

      <CardBody className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Indicator List</p>
            <p className="text-xs text-default-500">
              These support coaching judgment and do not replace it.
            </p>
          </div>

          <Button size="sm" variant="flat" onPress={addMeasurableIndicator}>
            Add Indicator
          </Button>
        </div>

        {values.measurableIndicators.length === 0 ? (
          <div className="rounded-medium border border-dashed px-4 py-6 text-sm text-default-500">
            No measurable indicators added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {values.measurableIndicators.map((indicator, index) => (
              <Card key={indicator.id} shadow="none" className="border">
                <CardBody className="gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">Indicator {index + 1}</p>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => removeMeasurableIndicator(index)}
                    >
                      Remove
                    </Button>
                  </div>

                  <Input
                    label="Title"
                    labelPlacement="outside"
                    value={indicator.title}
                    onValueChange={(value) =>
                      updateMeasurableIndicator(index, { title: value })
                    }
                    placeholder="e.g. 70% strike rate in bullpens"
                    isInvalid={!!errors[`measurableIndicators.${index}.title`]}
                    errorMessage={
                      errors[`measurableIndicators.${index}.title`]
                    }
                  />

                  <Input
                    label="Metric Type"
                    labelPlacement="outside"
                    value={indicator.metricType}
                    onValueChange={(value) =>
                      updateMeasurableIndicator(index, { metricType: value })
                    }
                    placeholder="e.g. objective_metric"
                  />

                  <Textarea
                    label="Description"
                    labelPlacement="outside"
                    value={indicator.description}
                    onValueChange={(value) =>
                      updateMeasurableIndicator(index, { description: value })
                    }
                    placeholder="Optional detail or interpretation notes"
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
