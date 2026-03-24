"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Radio,
  RadioGroup,
  Textarea,
} from "@heroui/react";

import { useEvaluationFormContext } from "./EvaluationFormProvider";

const BUCKET_STATUSES = [
  { key: "strength", label: "Strength" },
  { key: "developing", label: "Developing" },
  { key: "constraint", label: "Constraint" },
  { key: "not_relevant", label: "Not Relevant" },
] as const;

export function EvaluationBucketsStep() {
  const { availableBucketOptions, values, errors, updateBucket } =
    useEvaluationFormContext();
  const hasSelectedDiscipline = Boolean(values.disciplineId);
  const hasBucketOptions = availableBucketOptions.length > 0;

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Buckets</h3>
        <p className="text-sm text-default-500">
          Categorize the athlete across discipline-specific development buckets.
        </p>
      </CardHeader>

      <CardBody className="gap-4">
        <div>
          <div>
            <p className="text-sm font-medium">Bucket Assessments</p>
            <p className="text-xs text-default-500">
              Review each discipline bucket and select the most accurate status.
            </p>
          </div>
        </div>

        {errors.buckets ? (
          <p className="text-sm text-danger">{errors.buckets}</p>
        ) : null}

        {!hasSelectedDiscipline ? (
          <div className="rounded-medium border border-dashed px-4 py-6 text-sm text-default-500">
            Select a discipline in Basic Information to load bucket options.
          </div>
        ) : !hasBucketOptions ? (
          <div className="rounded-medium border border-dashed px-4 py-6 text-sm text-default-500">
            No active buckets are configured for this discipline.
          </div>
        ) : (
          <div className="space-y-4">
            {values.buckets.map((bucket, index) => (
              <Card key={bucket.id} shadow="none" className="border">
                <CardBody className="gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {availableBucketOptions[index]?.label ??
                        `Bucket ${index + 1}`}
                    </p>
                    {availableBucketOptions[index]?.description ? (
                      <p className="text-xs text-default-500">
                        {availableBucketOptions[index]?.description}
                      </p>
                    ) : null}
                  </div>

                  <RadioGroup
                    label="Status"
                    orientation="horizontal"
                    value={bucket.status}
                    onValueChange={(value) =>
                      updateBucket(index, {
                        status: value as typeof bucket.status,
                      })
                    }
                    isInvalid={!!errors[`buckets.${index}.status`]}
                    errorMessage={errors[`buckets.${index}.status`]}
                    classNames={{
                      wrapper: "gap-3",
                    }}
                  >
                    {BUCKET_STATUSES.map((item) => (
                      <Radio key={item.key} value={item.key}>
                        {item.label}
                      </Radio>
                    ))}
                  </RadioGroup>

                  <Textarea
                    label="Notes"
                    labelPlacement="outside"
                    value={bucket.notes}
                    onValueChange={(value) =>
                      updateBucket(index, { notes: value })
                    }
                    placeholder="Optional bucket notes"
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
