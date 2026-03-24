"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
} from "@heroui/react";

import {
  getSupportedEvidenceTypesForDisciplineKey,
  type EvaluationEvidenceType,
} from "@/domain/evaluations/evidence";

import { useEvaluationFormContext } from "./EvaluationFormProvider";

const EVIDENCE_TYPE_LABELS: Record<EvaluationEvidenceType, string> = {
  hittrax: "HitTrax",
  blast: "Blast",
  strength: "Strength",
};

const EVIDENCE_FIELDS: Record<
  EvaluationEvidenceType,
  Array<{ key: string; label: string }>
> = {
  hittrax: [
    { key: "exitVelocityMax", label: "Exit Velocity Max" },
    { key: "exitVelocityAvg", label: "Exit Velocity Avg" },
    { key: "hardHitPercent", label: "Hard Hit %" },
    { key: "launchAngleAvg", label: "Launch Angle Avg" },
    { key: "lineDriveAvg", label: "Line Drive Avg" },
  ],
  blast: [
    { key: "batSpeedMax", label: "Bat Speed Max" },
    { key: "batSpeedAvg", label: "Bat Speed Avg" },
    { key: "rotAccMax", label: "Rotational Acceleration Max" },
    { key: "rotAccAvg", label: "Rotational Acceleration Avg" },
    { key: "onPlanePercent", label: "On Plane %" },
    { key: "attackAngleAvg", label: "Attack Angle Avg" },
    { key: "earltConnAvg", label: "Early Connection Avg" },
    { key: "connAtImpactAvg", label: "Connection At Impact Avg" },
    { key: "verticalBatAngleAvg", label: "Vertical Bat Angle Avg" },
    { key: "timeToContactAvg", label: "Time To Contact Avg" },
    { key: "handSpeedMax", label: "Hand Speed Max" },
    { key: "handSpeedAvg", label: "Hand Speed Avg" },
  ],
  strength: [{ key: "powerRating", label: "Power Rating" }],
};

export function EvaluationEvidenceStep() {
  const {
    selectedDiscipline,
    values,
    errors,
    addEvidence,
    updateEvidence,
    removeEvidence,
  } = useEvaluationFormContext();

  const supportedTypes = getSupportedEvidenceTypesForDisciplineKey(
    selectedDiscipline?.key
  );
  const activeEvidenceTypes = new Set(values.evidence.map((item) => item.type));
  const missingTypes = supportedTypes.filter((type) => !activeEvidenceTypes.has(type));

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Evidence</h3>
        <p className="text-sm text-default-500">
          Add discipline-specific evidence forms. Each form creates a linked
          performance session when the evaluation is saved.
        </p>
      </CardHeader>

      <CardBody className="gap-4">
        {!selectedDiscipline ? (
          <div className="rounded-medium border border-dashed px-4 py-6 text-sm text-default-500">
            Select a discipline in Basic Information to load evidence forms.
          </div>
        ) : supportedTypes.length === 0 ? (
          <div className="rounded-medium border border-dashed px-4 py-6 text-sm text-default-500">
            Evidence forms are not configured for {selectedDiscipline.label}.
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {missingTypes.map((type) => (
                <Button
                  key={type}
                  size="sm"
                  variant="flat"
                  onPress={() => addEvidence(type)}
                >
                  Add {EVIDENCE_TYPE_LABELS[type]}
                </Button>
              ))}
            </div>

            {errors.evidence ? (
              <p className="text-sm text-danger">{errors.evidence}</p>
            ) : null}

            {values.evidence.length === 0 ? (
              <div className="rounded-medium border border-dashed px-4 py-6 text-sm text-default-500">
                No evidence forms added yet.
              </div>
            ) : (
              <div className="space-y-4">
                {values.evidence.map((evidence, index) => (
                  <Card key={evidence.id} shadow="none" className="border">
                    <CardBody className="gap-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">
                            {EVIDENCE_TYPE_LABELS[evidence.type]}
                          </p>
                          {evidence.performanceSessionId ? (
                            <p className="text-xs text-default-500">
                              Linked session: {evidence.performanceSessionId}
                            </p>
                          ) : null}
                        </div>

                        <Button
                          color="danger"
                          variant="light"
                          onPress={() => removeEvidence(index)}
                        >
                          Remove
                        </Button>
                      </div>

                      <Input
                        type="datetime-local"
                        label="Recorded At"
                        labelPlacement="outside"
                        value={evidence.recordedAt}
                        onValueChange={(value) =>
                          updateEvidence(index, { recordedAt: value })
                        }
                        isInvalid={!!errors[`evidence.${index}.recordedAt`]}
                        errorMessage={errors[`evidence.${index}.recordedAt`]}
                      />

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {EVIDENCE_FIELDS[evidence.type].map((field) => (
                          <Input
                            key={field.key}
                            type="number"
                            label={field.label}
                            labelPlacement="outside"
                            value={
                              (evidence as Record<string, string | undefined>)[
                                field.key
                              ] ?? ""
                            }
                            onValueChange={(value) =>
                              updateEvidence(index, {
                                [field.key]: value,
                              } as never)
                            }
                          />
                        ))}
                      </div>

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
          </>
        )}
      </CardBody>
    </Card>
  );
}
