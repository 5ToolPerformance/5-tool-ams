"use client";

import { Card, CardBody, CardHeader, Textarea } from "@heroui/react";

import { useDevelopmentPlanFormContext } from "./DevelopmentPlanFormProvider";

export function DevelopmentPlanOverviewStep() {
  const { values, errors, setFieldValue } = useDevelopmentPlanFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Plan Overview</h3>
        <p className="text-sm text-default-500">
          Describe the development direction and the most important current
          priority.
        </p>
      </CardHeader>

      <CardBody className="gap-4">
        <Textarea
          label="Plan Summary"
          labelPlacement="outside"
          placeholder="Summarize the intent of this development plan"
          value={values.summary}
          onValueChange={(value) => setFieldValue("summary", value)}
          minRows={6}
        />

        <Textarea
          label="Current Priority"
          labelPlacement="outside"
          placeholder="What matters most right now?"
          value={values.currentPriority}
          onValueChange={(value) => setFieldValue("currentPriority", value)}
          minRows={4}
          isInvalid={!!errors.currentPriority}
          errorMessage={errors.currentPriority}
        />
      </CardBody>
    </Card>
  );
}
