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

export function EvaluationStrengthProfileStep() {
  const {
    values,
    errors,
    setFieldValue,
    addStrength,
    updateStrength,
    removeStrength,
  } = useEvaluationFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Strength Profile</h3>
        <p className="text-sm text-default-500">
          Capture the athlete’s strongest traits and development identity.
        </p>
      </CardHeader>

      <CardBody className="gap-5">
        <Textarea
          label="Strength Profile Summary"
          labelPlacement="outside"
          placeholder="What natural advantages does this athlete have? What are you building around?"
          value={values.strengthProfileSummary}
          onValueChange={(value) =>
            setFieldValue("strengthProfileSummary", value)
          }
          minRows={6}
          isInvalid={!!errors.strengthProfileSummary}
          errorMessage={errors.strengthProfileSummary}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-medium">Strength List</h4>
              <p className="text-xs text-default-500">
                Add concise bullet-style strengths.
              </p>
            </div>

            <Button size="sm" variant="flat" onPress={addStrength}>
              Add Strength
            </Button>
          </div>

          {values.strengths.length === 0 ? (
            <div className="rounded-medium border border-dashed px-4 py-6 text-sm text-default-500">
              No strengths added yet.
            </div>
          ) : (
            <div className="space-y-3">
              {values.strengths.map((strength, index) => (
                <div key={`strength-${index}`} className="flex gap-2">
                  <Input
                    value={strength}
                    onValueChange={(value) => updateStrength(index, value)}
                    placeholder="e.g. Strong rotational intent"
                  />
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => removeStrength(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Textarea
          label="Strength Profile Notes"
          labelPlacement="outside"
          placeholder="Optional additional notes"
          value={values.strengthProfileNotes}
          onValueChange={(value) =>
            setFieldValue("strengthProfileNotes", value)
          }
          minRows={4}
        />
      </CardBody>
    </Card>
  );
}
