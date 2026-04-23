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

export function EvaluationConstraintsStep() {
  const {
    values,
    errors,
    setFieldValue,
    addConstraint,
    updateConstraint,
    removeConstraint,
  } = useEvaluationFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Constraints</h3>
        <p className="text-sm text-default-500">
          Identify the current limiting factors and highest-leverage
          constraints.
        </p>
      </CardHeader>

      <CardBody className="gap-5">
        <Textarea
          label="Key Constraints Summary"
          labelPlacement="outside"
          placeholder="What is currently holding performance back? What must improve to unlock the next level?"
          value={values.keyConstraintsSummary}
          onValueChange={(value) =>
            setFieldValue("keyConstraintsSummary", value)
          }
          minRows={6}
          isInvalid={!!errors.keyConstraintsSummary}
          errorMessage={errors.keyConstraintsSummary}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-medium">Constraint List</h4>
              <p className="text-xs text-default-500">
                Add specific development constraints.
              </p>
            </div>

            <Button size="sm" variant="flat" onPress={addConstraint}>
              Add Constraint
            </Button>
          </div>

          {values.constraints.length === 0 ? (
            <div className="rounded-medium border border-dashed px-4 py-6 text-sm text-default-500">
              No constraints added yet.
            </div>
          ) : (
            <div className="space-y-3">
              {values.constraints.map((constraint, index) => (
                <div key={`constraint-${index}`} className="flex gap-2">
                  <Input
                    value={constraint}
                    onValueChange={(value) => updateConstraint(index, value)}
                    placeholder="e.g. Inconsistent landing direction"
                  />
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => removeConstraint(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Textarea
          label="Constraint Notes"
          labelPlacement="outside"
          placeholder="Optional supporting notes"
          value={values.constraintsNotes}
          onValueChange={(value) => setFieldValue("constraintsNotes", value)}
          minRows={4}
        />
      </CardBody>
    </Card>
  );
}
