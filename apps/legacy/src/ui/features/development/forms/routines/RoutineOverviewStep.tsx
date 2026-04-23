"use client";

import { Card, CardBody, CardHeader, Textarea } from "@heroui/react";

import { useRoutineFormContext } from "./RoutineFormProvider";

export function RoutineOverviewStep() {
  const { values, setFieldValue } = useRoutineFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Overview</h3>
        <p className="text-sm text-default-500">
          Summarize what this routine is for and how coaches should use it.
        </p>
      </CardHeader>

      <CardBody className="gap-4">
        <Textarea
          label="Summary"
          labelPlacement="outside"
          placeholder="What does this routine target?"
          value={values.summary}
          onValueChange={(value) => setFieldValue("summary", value)}
          minRows={5}
        />

        <Textarea
          label="Usage Notes"
          labelPlacement="outside"
          placeholder="How should coaches use or apply this routine?"
          value={values.usageNotes}
          onValueChange={(value) => setFieldValue("usageNotes", value)}
          minRows={5}
        />
      </CardBody>
    </Card>
  );
}
