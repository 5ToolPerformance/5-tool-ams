"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";

import { useDevelopmentPlanFormContext } from "./DevelopmentPlanFormProvider";

const PLAN_STATUSES = [
  { key: "draft", label: "Draft" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "archived", label: "Archived" },
] as const;

function formatEvaluationDate(value: Date | string) {
  const parsed = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

export function DevelopmentPlanBasicInfoStep() {
  const {
    mode,
    evaluationOptions,
    selectedEvaluation,
    isEvaluationSelectionLocked,
    values,
    errors,
    setFieldValue,
  } = useDevelopmentPlanFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Basic Information</h3>
        <p className="text-sm text-default-500">
          Bind this plan to an evaluation, then define its status and timeline.
        </p>
      </CardHeader>

      <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {mode === "create" ? (
          isEvaluationSelectionLocked ? (
            <div className="md:col-span-2">
              <Input
                label="Source Evaluation"
                labelPlacement="outside"
                isReadOnly
                value={
                  selectedEvaluation
                    ? `${selectedEvaluation.disciplineLabel} • ${formatEvaluationDate(
                        selectedEvaluation.evaluationDate
                      )} • ${selectedEvaluation.evaluationType}`
                    : "Evaluation not found"
                }
                description="This plan was opened directly from the evaluation flow."
              />
            </div>
          ) : (
            <div className="md:col-span-2">
              <Select
                label="Evaluation"
                labelPlacement="outside"
                placeholder={
                  evaluationOptions.length > 0
                    ? "Select an evaluation"
                    : "No evaluations available"
                }
                selectedKeys={values.evaluationId ? [values.evaluationId] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  if (typeof selected === "string") {
                    setFieldValue("evaluationId", selected);
                  }
                }}
                disallowEmptySelection
                isDisabled={evaluationOptions.length === 0}
                isInvalid={!!errors.evaluationId}
                errorMessage={errors.evaluationId}
              >
                {evaluationOptions.map((option) => (
                  <SelectItem
                    key={option.id}
                    textValue={`${option.disciplineLabel} ${option.evaluationType} ${option.phase} ${option.summary}`}
                  >
                    {`${formatEvaluationDate(option.evaluationDate)} • ${option.evaluationType} • ${option.phase}`}
                  </SelectItem>
                ))}
              </Select>
            </div>
          )
        ) : null}

        <Input
          label="Discipline"
          labelPlacement="outside"
          isReadOnly
          value={
            selectedEvaluation?.disciplineLabel ??
            selectedEvaluation?.disciplineId ??
            "Inherited from evaluation"
          }
        />

        <Select
          label="Status"
          labelPlacement="outside"
          selectedKeys={[values.status]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0];
            if (typeof selected === "string") {
              setFieldValue("status", selected as typeof values.status);
            }
          }}
          isInvalid={!!errors.status}
          errorMessage={errors.status}
        >
          {PLAN_STATUSES.map((item) => (
            <SelectItem key={item.key}>{item.label}</SelectItem>
          ))}
        </Select>

        <Input
          type="date"
          label="Start Date"
          labelPlacement="outside"
          value={values.startDate}
          onValueChange={(value) => setFieldValue("startDate", value)}
        />

        <Input
          type="date"
          label="Target End Date"
          labelPlacement="outside"
          value={values.targetEndDate}
          onValueChange={(value) => setFieldValue("targetEndDate", value)}
        />

        {selectedEvaluation ? (
          <div className="rounded-large border bg-default-50 p-4 text-sm md:col-span-2">
            <p className="font-medium">Selected Evaluation</p>
            <p className="mt-1 text-default-600">
              {formatEvaluationDate(selectedEvaluation.evaluationDate)} |{" "}
              {selectedEvaluation.evaluationType} | {selectedEvaluation.phase}
            </p>
            {selectedEvaluation.summary ? (
              <p className="mt-2 text-default-600">
                {selectedEvaluation.summary}
              </p>
            ) : null}
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}
