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

export function EvaluationEvidenceStep() {
  const { values, errors, addEvidence, updateEvidence, removeEvidence } =
    useEvaluationFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Evidence</h3>
        <p className="text-sm text-default-500">
          Link supporting assessment or performance session context where
          available.
        </p>
      </CardHeader>

      <CardBody className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Supporting Evidence</p>
            <p className="text-xs text-default-500">
              Add performance session references and short notes.
            </p>
          </div>

          <Button size="sm" variant="flat" onPress={addEvidence}>
            Add Evidence
          </Button>
        </div>

        {values.evidence.length === 0 ? (
          <div className="rounded-medium border border-dashed px-4 py-6 text-sm text-default-500">
            No evidence added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {values.evidence.map((evidence, index) => (
              <Card key={evidence.id} shadow="none" className="border">
                <CardBody className="gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">Evidence {index + 1}</p>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => removeEvidence(index)}
                    >
                      Remove
                    </Button>
                  </div>

                  <Input
                    label="Performance Session ID"
                    labelPlacement="outside"
                    value={evidence.performanceSessionId}
                    onValueChange={(value) =>
                      updateEvidence(index, { performanceSessionId: value })
                    }
                    placeholder="Can become a selector later"
                    isInvalid={
                      !!errors[`evidence.${index}.performanceSessionId`]
                    }
                    errorMessage={
                      errors[`evidence.${index}.performanceSessionId`]
                    }
                  />

                  <Textarea
                    label="Notes"
                    labelPlacement="outside"
                    value={evidence.notes}
                    onValueChange={(value) =>
                      updateEvidence(index, { notes: value })
                    }
                    placeholder="Optional evidence notes"
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
