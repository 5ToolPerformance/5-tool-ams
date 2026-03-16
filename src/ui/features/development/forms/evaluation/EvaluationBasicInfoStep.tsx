"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";

import { useEvaluationFormContext } from "./EvaluationFormProvider";

const EVALUATION_TYPES = [
  { key: "baseline", label: "Baseline" },
  { key: "monthly", label: "Monthly" },
  { key: "season_review", label: "Season Review" },
  { key: "injury_return", label: "Injury Return" },
  { key: "general", label: "General" },
] as const;

const PHASES = [
  { key: "offseason", label: "Offseason" },
  { key: "preseason", label: "Preseason" },
  { key: "inseason", label: "In-Season" },
  { key: "postseason", label: "Postseason" },
  { key: "rehab", label: "Rehab" },
  { key: "return_to_play", label: "Return to Play" },
  { key: "general", label: "General" },
] as const;

export function EvaluationBasicInfoStep() {
  const { disciplineOptions, values, errors, setFieldValue } =
    useEvaluationFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Basic Information</h3>
        <p className="text-sm text-default-500">
          Define the evaluation context before moving into assessment details.
        </p>
      </CardHeader>

      <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Select
          label="Discipline"
          labelPlacement="outside"
          placeholder={
            disciplineOptions.length > 0
              ? "Select a discipline"
              : "No disciplines available"
          }
          selectedKeys={values.disciplineId ? [values.disciplineId] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0];
            if (typeof selected === "string") {
              setFieldValue("disciplineId", selected);
            }
          }}
          isDisabled={disciplineOptions.length === 0}
          isInvalid={!!errors.disciplineId}
          errorMessage={errors.disciplineId}
        >
          {disciplineOptions.map((item) => (
            <SelectItem key={item.id}>{item.label}</SelectItem>
          ))}
        </Select>

        <Input
          type="date"
          label="Evaluation Date"
          labelPlacement="outside"
          value={values.evaluationDate}
          onValueChange={(value) => setFieldValue("evaluationDate", value)}
          isInvalid={!!errors.evaluationDate}
          errorMessage={errors.evaluationDate}
        />

        <Select
          label="Evaluation Type"
          labelPlacement="outside"
          selectedKeys={[values.evaluationType]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0];
            if (typeof selected === "string") {
              setFieldValue(
                "evaluationType",
                selected as typeof values.evaluationType
              );
            }
          }}
          isInvalid={!!errors.evaluationType}
          errorMessage={errors.evaluationType}
        >
          {EVALUATION_TYPES.map((item) => (
            <SelectItem key={item.key}>{item.label}</SelectItem>
          ))}
        </Select>

        <Select
          label="Phase"
          labelPlacement="outside"
          selectedKeys={[values.phase]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0];
            if (typeof selected === "string") {
              setFieldValue("phase", selected as typeof values.phase);
            }
          }}
          isInvalid={!!errors.phase}
          errorMessage={errors.phase}
        >
          {PHASES.map((item) => (
            <SelectItem key={item.key}>{item.label}</SelectItem>
          ))}
        </Select>

        <Input
          label="Injury Considerations"
          labelPlacement="outside"
          placeholder="Optional notes on injury context or return-to-play considerations"
          value={values.injuryConsiderations}
          onValueChange={(value) =>
            setFieldValue("injuryConsiderations", value)
          }
        />
      </CardBody>
    </Card>
  );
}
