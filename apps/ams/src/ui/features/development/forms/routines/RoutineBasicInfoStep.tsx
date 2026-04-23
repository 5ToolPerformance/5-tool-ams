"use client";

import {
  Button,
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
    contextType,
    developmentPlanOptions,
    disciplineOptions,
    selectedDevelopmentPlan,
    selectedDiscipline,
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
          {contextType === "universal"
            ? "Choose a discipline and define the shared routine coaches can reuse across plans."
            : "Choose an optional plan link and define the routine's basic identity."}
        </p>
      </CardHeader>

      <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {contextType === "development-plan" && mode === "create" ? (
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
            <div className="space-y-3 md:col-span-2">
              <Select
                label="Development Plan"
                labelPlacement="outside"
                placeholder={
                  developmentPlanOptions.length > 0
                    ? "Optionally select a development plan"
                    : "No development plans available"
                }
                selectedKeys={
                  values.developmentPlanId ? [values.developmentPlanId] : []
                }
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0];
                  if (typeof selected === "string") {
                    setFieldValue("developmentPlanId", selected);
                    return;
                  }

                  setFieldValue("developmentPlanId", "");
                }}
                disallowEmptySelection={false}
                selectionMode="single"
                isDisabled={developmentPlanOptions.length === 0}
                isInvalid={!!errors.developmentPlanId}
                errorMessage={errors.developmentPlanId}
                description="Optional. Link this routine to a development plan, or leave it as a standalone player routine."
              >
                {developmentPlanOptions.map((option) => (
                  <SelectItem key={option.id}>{option.title}</SelectItem>
                ))}
              </Select>
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="flat"
                  onPress={() => setFieldValue("developmentPlanId", "")}
                  isDisabled={!values.developmentPlanId}
                >
                  Clear Plan Link
                </Button>
              </div>
            </div>
          )
        ) : null}

        {contextType === "universal" ? (
          <div className="md:col-span-2">
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
              isDisabled={mode === "edit" || disciplineOptions.length === 0}
              isInvalid={!!errors.disciplineId}
              errorMessage={errors.disciplineId}
            >
              {disciplineOptions.map((option) => (
                <SelectItem key={option.id}>{option.label}</SelectItem>
              ))}
              </Select>
          </div>
        ) : selectedDevelopmentPlan ? (
          <Input
            label="Discipline"
            labelPlacement="outside"
            isReadOnly
            value={selectedDiscipline?.label ?? "Inherited from development plan"}
          />
        ) : (
          <div className="md:col-span-2">
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
              description="Choose the discipline for this standalone player routine, or select a development plan to inherit it."
            >
              {disciplineOptions.map((option) => (
                <SelectItem key={option.id}>{option.label}</SelectItem>
              ))}
            </Select>
          </div>
        )}

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

        <div className="flex items-end md:col-span-2">
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
