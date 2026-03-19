"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
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
  const {
    availableBucketOptions,
    values,
    errors,
    addBucket,
    updateBucket,
    removeBucket,
  } = useEvaluationFormContext();
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
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Bucket Assessments</p>
            <p className="text-xs text-default-500">
              Add only the buckets relevant to this evaluation.
            </p>
          </div>

          <Button
            size="sm"
            variant="flat"
            onPress={addBucket}
            isDisabled={!hasSelectedDiscipline || !hasBucketOptions}
          >
            Add Bucket
          </Button>
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
        ) : values.buckets.length === 0 ? (
          <div className="rounded-medium border border-dashed px-4 py-6 text-sm text-default-500">
            No buckets added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {values.buckets.map((bucket, index) => (
              <Card key={bucket.id} shadow="none" className="border">
                <CardBody className="gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">Bucket {index + 1}</p>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => removeBucket(index)}
                    >
                      Remove
                    </Button>
                  </div>

                  <Select
                    label="Bucket"
                    labelPlacement="outside"
                    placeholder="Select a bucket"
                    selectedKeys={bucket.bucketId ? [bucket.bucketId] : []}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0];
                      if (typeof selected === "string") {
                        updateBucket(index, { bucketId: selected });
                      }
                    }}
                    isDisabled={!hasBucketOptions}
                    isInvalid={!!errors[`buckets.${index}.bucketId`]}
                    errorMessage={errors[`buckets.${index}.bucketId`]}
                    description={
                      bucket.bucketId
                        ? availableBucketOptions.find(
                            (option) => option.id === bucket.bucketId
                          )?.description ?? undefined
                        : undefined
                    }
                  >
                    {availableBucketOptions
                      .filter((option) => {
                        if (option.id === bucket.bucketId) {
                          return true;
                        }

                        return !values.buckets.some(
                          (entry, entryIndex) =>
                            entryIndex !== index && entry.bucketId === option.id
                        );
                      })
                      .map((option) => (
                        <SelectItem key={option.id}>{option.label}</SelectItem>
                      ))}
                  </Select>

                  <Select
                    label="Status"
                    labelPlacement="outside"
                    selectedKeys={[bucket.status]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0];
                      if (typeof selected === "string") {
                        updateBucket(index, {
                          status: selected as typeof bucket.status,
                        });
                      }
                    }}
                  >
                    {BUCKET_STATUSES.map((item) => (
                      <SelectItem key={item.key}>{item.label}</SelectItem>
                    ))}
                  </Select>

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
