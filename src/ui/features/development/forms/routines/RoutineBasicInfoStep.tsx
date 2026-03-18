"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Switch,
} from "@heroui/react";

import { useRoutineFormContext } from "./RoutineFormProvider";

const ROUTINE_TYPES = [
  { key: "partial_lesson", label: "Partial Lesson" },
  { key: "full_lesson", label: "Full Lesson" },
  { key: "progression", label: "Progression" },
] as const;

export function RoutineBasicInfoStep() {
  const {
    mode,
    developmentPlanOptions,
    selectedDevelopmentPlan,
    isDevelopmentPlanSelectionLocked,
    values,
    errors,
    setFieldValue,
  } = useRoutineFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Basic Information</h3>
        <p className="text-sm text-default-500">
          Select the plan context and define the routine&apos;s basic identity.
        </p>
      </CardHeader>

      <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {mode === "create" ? (
          isDevelopmentPlanSelectionLocked ? (
            <div className="md:col-span-2">
              <Input
                label="Development Plan"
                labelPlacement="outside"
                isReadOnly
                value={selectedDevelopmentPlan?.title ?? "Development plan"}
                description="This routine was opened directly from the development plan flow."
              />
            </div>
          ) : (
            <div className="md:col-span-2">
              <Select
                label="Development Plan"
                labelPlacement="outside"
                placeholder={
                  developmentPlanOptions.length > 0
                    ? "Select a development plan"
                    : "No development plans available"
                }
                selectedKeys={
                  values.developmentPlanId ? [values.developmentPlanId] : []
                }
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  if (typeof selected === "string") {
                    setFieldValue("developmentPlanId", selected);
                  }
                }}
                isDisabled={developmentPlanOptions.length === 0}
                isInvalid={!!errors.developmentPlanId}
                errorMessage={errors.developmentPlanId}
              >
                {developmentPlanOptions.map((option) => (
                  <SelectItem key={option.id}>{option.title}</SelectItem>
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
            selectedDevelopmentPlan?.disciplineLabel ?? "Inherited from plan"
          }
        />

        <Input
          label="Routine Title"
          labelPlacement="outside"
          value={values.title}
          onValueChange={(value) => setFieldValue("title", value)}
          placeholder="e.g. Pre-Hit Timing Routine"
          isInvalid={!!errors.title}
          errorMessage={errors.title}
        />

        <Select
          label="Routine Type"
          labelPlacement="outside"
          selectedKeys={[values.routineType]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0];
            if (typeof selected === "string") {
              setFieldValue("routineType", selected as typeof values.routineType);
            }
          }}
          isInvalid={!!errors.routineType}
          errorMessage={errors.routineType}
        >
          {ROUTINE_TYPES.map((item) => (
            <SelectItem key={item.key}>{item.label}</SelectItem>
          ))}
        </Select>

        <Input
          type="number"
          label="Sort Order"
          labelPlacement="outside"
          value={String(values.sortOrder)}
          onValueChange={(value) =>
            setFieldValue(
              "sortOrder",
              Number.isNaN(Number(value)) ? 0 : Number(value)
            )
          }
          min={0}
        />

        <div className="flex items-end">
          <Switch
            isSelected={values.isActive}
            onValueChange={(value) => setFieldValue("isActive", value)}
          >
            Active Routine
          </Switch>
        </div>

        <div className="md:col-span-2">
          <Input
            label="Description"
            labelPlacement="outside"
            value={values.description}
            onValueChange={(value) => setFieldValue("description", value)}
            placeholder="Short description of the routine"
          />
        </div>
      </CardBody>
    </Card>
  );
}
