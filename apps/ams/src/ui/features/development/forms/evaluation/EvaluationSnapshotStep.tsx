"use client";

import { Card, CardBody, CardHeader, Textarea } from "@heroui/react";

import { useEvaluationFormContext } from "./EvaluationFormProvider";

export function EvaluationSnapshotStep() {
  const { values, errors, setFieldValue } = useEvaluationFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Snapshot</h3>
        <p className="text-sm text-default-500">
          Summarize where the athlete is now in the current discipline context.
        </p>
      </CardHeader>

      <CardBody className="gap-4">
        <Textarea
          label="Snapshot Summary"
          labelPlacement="outside"
          placeholder="What are you currently seeing? What is working? What is limiting performance?"
          value={values.snapshotSummary}
          onValueChange={(value) => setFieldValue("snapshotSummary", value)}
          minRows={6}
          isInvalid={!!errors.snapshotSummary}
          errorMessage={errors.snapshotSummary}
        />

        <Textarea
          label="Snapshot Notes"
          labelPlacement="outside"
          placeholder="Optional supporting notes for internal coaching context"
          value={values.snapshotNotes}
          onValueChange={(value) => setFieldValue("snapshotNotes", value)}
          minRows={4}
        />
      </CardBody>
    </Card>
  );
}
