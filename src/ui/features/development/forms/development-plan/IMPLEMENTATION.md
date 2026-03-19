Below is a complete starter set for the six development plan form files, matching the same approach as the evaluation form.

A few assumptions:

- You have `createDevelopmentPlan` and `updateDevelopmentPlan` application functions available.
- Your document type lives at `@/types/development/developmentPlans`.
- Your app exposes `db` from `@/db`.
- Edit mode returns a record with the fields shown in `DevelopmentPlanFormRecord`.

---

## `developmentPlanForm.types.ts`

```ts
import type { DevelopmentPlanDocumentV1 } from "@/types/development/developmentPlans";

export type DevelopmentPlanStatus =
  | "draft"
  | "active"
  | "completed"
  | "archived";

export type DevelopmentPlanSubmitAction = "save" | "save-and-routine";
export type DevelopmentPlanFormMode = "create" | "edit";

export type DevelopmentPlanFormListItem = {
  id: string;
  title: string;
  description: string;
};

export type DevelopmentPlanFormMeasurableIndicator = {
  id: string;
  title: string;
  description: string;
  metricType: string;
};

export type DevelopmentPlanFormValues = {
  status: DevelopmentPlanStatus;
  startDate: string;
  targetEndDate: string;

  summary: string;
  currentPriority: string;

  shortTermGoals: DevelopmentPlanFormListItem[];
  longTermGoals: DevelopmentPlanFormListItem[];
  focusAreas: DevelopmentPlanFormListItem[];
  measurableIndicators: DevelopmentPlanFormMeasurableIndicator[];
};

export type DevelopmentPlanFormErrorMap = Partial<Record<string, string>>;

export type DevelopmentPlanFormRecord = {
  id: string;
  playerId: string;
  disciplineId: string;
  evaluationId: string;
  createdBy: string;
  status: DevelopmentPlanStatus;
  startDate: Date | string | null;
  targetEndDate: Date | string | null;
  documentData: DevelopmentPlanDocumentV1 | null;
};

export type DevelopmentPlanCreateContext = {
  playerId: string;
  disciplineId: string;
  evaluationId: string;
  createdBy: string;
};

export type DevelopmentPlanFormSubmitPayload = {
  playerId: string;
  disciplineId: string;
  evaluationId: string;
  createdBy: string;
  status: DevelopmentPlanStatus;
  startDate?: Date | null;
  targetEndDate?: Date | null;
  documentData: DevelopmentPlanDocumentV1;
};

export type DevelopmentPlanFormContextValue = {
  mode: DevelopmentPlanFormMode;
  values: DevelopmentPlanFormValues;
  errors: DevelopmentPlanFormErrorMap;
  isSubmitting: boolean;
  submitAction: DevelopmentPlanSubmitAction | null;

  setFieldValue: <K extends keyof DevelopmentPlanFormValues>(
    key: K,
    value: DevelopmentPlanFormValues[K]
  ) => void;

  addShortTermGoal: () => void;
  updateShortTermGoal: (
    index: number,
    value: Partial<DevelopmentPlanFormListItem>
  ) => void;
  removeShortTermGoal: (index: number) => void;

  addLongTermGoal: () => void;
  updateLongTermGoal: (
    index: number,
    value: Partial<DevelopmentPlanFormListItem>
  ) => void;
  removeLongTermGoal: (index: number) => void;

  addFocusArea: () => void;
  updateFocusArea: (
    index: number,
    value: Partial<DevelopmentPlanFormListItem>
  ) => void;
  removeFocusArea: (index: number) => void;

  addMeasurableIndicator: () => void;
  updateMeasurableIndicator: (
    index: number,
    value: Partial<DevelopmentPlanFormMeasurableIndicator>
  ) => void;
  removeMeasurableIndicator: (index: number) => void;

  handleSubmit: (action: DevelopmentPlanSubmitAction) => Promise<void>;
  resetForm: () => void;
};

export type DevelopmentPlanFormProviderProps = {
  mode: DevelopmentPlanFormMode;
  playerId?: string;
  disciplineId?: string;
  evaluationId?: string;
  createdBy: string;
  initialDevelopmentPlan?: DevelopmentPlanFormRecord | null;
  onCancel?: () => void;
  onSaved?: (developmentPlanId: string) => void;
  onSavedAndContinue?: (developmentPlanId: string) => void;
  children: React.ReactNode;
};
```

---

## `developmentPlanForm.defaults.ts`

```ts
import type {
  DevelopmentPlanFormListItem,
  DevelopmentPlanFormMeasurableIndicator,
  DevelopmentPlanFormRecord,
  DevelopmentPlanFormValues,
} from "./developmentPlanForm.types";

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function toDateInputValue(date: Date | string | null | undefined): string {
  if (!date) return "";

  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  const year = parsed.getFullYear();
  const month = `${parsed.getMonth() + 1}`.padStart(2, "0");
  const day = `${parsed.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function createEmptyDevelopmentPlanFormValues(): DevelopmentPlanFormValues {
  return {
    status: "draft",
    startDate: "",
    targetEndDate: "",

    summary: "",
    currentPriority: "",

    shortTermGoals: [],
    longTermGoals: [],
    focusAreas: [],
    measurableIndicators: [],
  };
}

export function createDevelopmentPlanFormValuesFromRecord(
  developmentPlan: DevelopmentPlanFormRecord
): DevelopmentPlanFormValues {
  const doc = developmentPlan.documentData;

  return {
    status: developmentPlan.status,
    startDate: toDateInputValue(developmentPlan.startDate),
    targetEndDate: toDateInputValue(developmentPlan.targetEndDate),

    summary: doc?.summary ?? "",
    currentPriority: doc?.currentPriority ?? "",

    shortTermGoals: (doc?.shortTermGoals ?? []).map((item) => ({
      id: createId("stg"),
      title: item.title ?? "",
      description: item.description ?? "",
    })),

    longTermGoals: (doc?.longTermGoals ?? []).map((item) => ({
      id: createId("ltg"),
      title: item.title ?? "",
      description: item.description ?? "",
    })),

    focusAreas: (doc?.focusAreas ?? []).map((item) => ({
      id: createId("focus"),
      title: item.title ?? "",
      description: item.description ?? "",
    })),

    measurableIndicators: (doc?.measurableIndicators ?? []).map((item) => ({
      id: createId("metric"),
      title: item.title ?? "",
      description: item.description ?? "",
      metricType: item.metricType ?? "",
    })),
  };
}

export function cloneDevelopmentPlanFormValues(
  values: DevelopmentPlanFormValues
): DevelopmentPlanFormValues {
  return {
    ...values,
    shortTermGoals: values.shortTermGoals.map((item) => ({ ...item })),
    longTermGoals: values.longTermGoals.map((item) => ({ ...item })),
    focusAreas: values.focusAreas.map((item) => ({ ...item })),
    measurableIndicators: values.measurableIndicators.map((item) => ({
      ...item,
    })),
  };
}

export function createEmptyDevelopmentPlanListItem(
  prefix = "item"
): DevelopmentPlanFormListItem {
  return {
    id: createId(prefix),
    title: "",
    description: "",
  };
}

export function createEmptyMeasurableIndicator(): DevelopmentPlanFormMeasurableIndicator {
  return {
    id: createId("metric"),
    title: "",
    description: "",
    metricType: "",
  };
}
```

---

## `developmentPlanForm.serialization.ts`

```ts
import type { DevelopmentPlanDocumentV1 } from "@/types/development/developmentPlans";

import type {
  DevelopmentPlanCreateContext,
  DevelopmentPlanFormSubmitPayload,
  DevelopmentPlanFormValues,
} from "./developmentPlanForm.types";

function emptyToUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function parseOptionalDateInput(value: string): Date | null {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function serializeDevelopmentPlanFormToDocumentData(
  values: DevelopmentPlanFormValues
): DevelopmentPlanDocumentV1 {
  const shortTermGoals = values.shortTermGoals
    .map((item) => ({
      title: item.title.trim(),
      description: emptyToUndefined(item.description),
    }))
    .filter((item) => item.title);

  const longTermGoals = values.longTermGoals
    .map((item) => ({
      title: item.title.trim(),
      description: emptyToUndefined(item.description),
    }))
    .filter((item) => item.title);

  const focusAreas = values.focusAreas
    .map((item) => ({
      title: item.title.trim(),
      description: emptyToUndefined(item.description),
    }))
    .filter((item) => item.title);

  const measurableIndicators = values.measurableIndicators
    .map((item) => ({
      title: item.title.trim(),
      description: emptyToUndefined(item.description),
      metricType: emptyToUndefined(item.metricType),
    }))
    .filter((item) => item.title);

  return {
    version: 1,
    summary: emptyToUndefined(values.summary),
    currentPriority: emptyToUndefined(values.currentPriority),
    shortTermGoals: shortTermGoals.length ? shortTermGoals : undefined,
    longTermGoals: longTermGoals.length ? longTermGoals : undefined,
    focusAreas: focusAreas.length ? focusAreas : undefined,
    measurableIndicators: measurableIndicators.length
      ? measurableIndicators
      : undefined,
  };
}

export function serializeDevelopmentPlanFormToPayload(
  values: DevelopmentPlanFormValues,
  context: DevelopmentPlanCreateContext
): DevelopmentPlanFormSubmitPayload {
  return {
    playerId: context.playerId,
    disciplineId: context.disciplineId,
    evaluationId: context.evaluationId,
    createdBy: context.createdBy,
    status: values.status,
    startDate: parseOptionalDateInput(values.startDate),
    targetEndDate: parseOptionalDateInput(values.targetEndDate),
    documentData: serializeDevelopmentPlanFormToDocumentData(values),
  };
}
```

---

## `developmentPlanForm.validation.ts`

```ts
import type {
  DevelopmentPlanFormErrorMap,
  DevelopmentPlanFormValues,
} from "./developmentPlanForm.types";

export function validateDevelopmentPlanForm(
  values: DevelopmentPlanFormValues
): DevelopmentPlanFormErrorMap {
  const errors: DevelopmentPlanFormErrorMap = {};

  if (!values.status) {
    errors.status = "Status is required.";
  }

  if (values.status === "active" && !values.currentPriority.trim()) {
    errors.currentPriority =
      "Current priority is recommended when a plan is active.";
  }

  values.shortTermGoals.forEach((item, index) => {
    if (!item.title.trim()) {
      errors[`shortTermGoals.${index}.title`] =
        "Short-term goal title is required.";
    }
  });

  values.longTermGoals.forEach((item, index) => {
    if (!item.title.trim()) {
      errors[`longTermGoals.${index}.title`] =
        "Long-term goal title is required.";
    }
  });

  values.focusAreas.forEach((item, index) => {
    if (!item.title.trim()) {
      errors[`focusAreas.${index}.title`] = "Focus area title is required.";
    }
  });

  values.measurableIndicators.forEach((item, index) => {
    if (!item.title.trim()) {
      errors[`measurableIndicators.${index}.title`] =
        "Indicator title is required.";
    }
  });

  return errors;
}

export function hasDevelopmentPlanFormErrors(
  errors: DevelopmentPlanFormErrorMap
): boolean {
  return Object.keys(errors).length > 0;
}
```

---

## `useDevelopmentPlanForm.ts`

```ts
import { useCallback, useMemo, useState } from "react";

import { createDevelopmentPlan as createDevelopmentPlanAction } from "@/application/development-plans/createDevelopmentPlan";
import { updateDevelopmentPlan as updateDevelopmentPlanAction } from "@/application/development-plans/updateDevelopmentPlan";
import { db } from "@/db";

import {
  cloneDevelopmentPlanFormValues,
  createDevelopmentPlanFormValuesFromRecord,
  createEmptyDevelopmentPlanFormValues,
  createEmptyDevelopmentPlanListItem,
  createEmptyMeasurableIndicator,
} from "./developmentPlanForm.defaults";
import { serializeDevelopmentPlanFormToPayload } from "./developmentPlanForm.serialization";
import type {
  DevelopmentPlanCreateContext,
  DevelopmentPlanFormErrorMap,
  DevelopmentPlanFormMode,
  DevelopmentPlanFormRecord,
  DevelopmentPlanFormSubmitPayload,
  DevelopmentPlanFormValues,
  DevelopmentPlanSubmitAction,
} from "./developmentPlanForm.types";
import {
  hasDevelopmentPlanFormErrors,
  validateDevelopmentPlanForm,
} from "./developmentPlanForm.validation";

type UseDevelopmentPlanFormParams = {
  mode: DevelopmentPlanFormMode;
  playerId?: string;
  disciplineId?: string;
  evaluationId?: string;
  createdBy: string;
  initialDevelopmentPlan?: DevelopmentPlanFormRecord | null;
  onSaved?: (developmentPlanId: string) => void;
  onSavedAndContinue?: (developmentPlanId: string) => void;
};

function getInitialValues(
  params: UseDevelopmentPlanFormParams
): DevelopmentPlanFormValues {
  if (params.mode === "edit" && params.initialDevelopmentPlan) {
    return createDevelopmentPlanFormValuesFromRecord(
      params.initialDevelopmentPlan
    );
  }

  return createEmptyDevelopmentPlanFormValues();
}

export function useDevelopmentPlanForm(params: UseDevelopmentPlanFormParams) {
  const initialValues = useMemo(() => getInitialValues(params), [params]);
  const [values, setValues] =
    useState<DevelopmentPlanFormValues>(initialValues);
  const [errors, setErrors] = useState<DevelopmentPlanFormErrorMap>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAction, setSubmitAction] =
    useState<DevelopmentPlanSubmitAction | null>(null);

  const resetForm = useCallback(() => {
    setValues(cloneDevelopmentPlanFormValues(initialValues));
    setErrors({});
    setSubmitAction(null);
  }, [initialValues]);

  const setFieldValue = useCallback(
    <K extends keyof DevelopmentPlanFormValues>(
      key: K,
      value: DevelopmentPlanFormValues[K]
    ) => {
      setValues((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const addShortTermGoal = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      shortTermGoals: [
        ...prev.shortTermGoals,
        createEmptyDevelopmentPlanListItem("stg"),
      ],
    }));
  }, []);

  const updateShortTermGoal = useCallback(
    (
      index: number,
      value: Partial<DevelopmentPlanFormValues["shortTermGoals"][number]>
    ) => {
      setValues((prev) => {
        const next = [...prev.shortTermGoals];
        next[index] = { ...next[index], ...value };
        return { ...prev, shortTermGoals: next };
      });
    },
    []
  );

  const removeShortTermGoal = useCallback((index: number) => {
    setValues((prev) => ({
      ...prev,
      shortTermGoals: prev.shortTermGoals.filter((_, i) => i !== index),
    }));
  }, []);

  const addLongTermGoal = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      longTermGoals: [
        ...prev.longTermGoals,
        createEmptyDevelopmentPlanListItem("ltg"),
      ],
    }));
  }, []);

  const updateLongTermGoal = useCallback(
    (
      index: number,
      value: Partial<DevelopmentPlanFormValues["longTermGoals"][number]>
    ) => {
      setValues((prev) => {
        const next = [...prev.longTermGoals];
        next[index] = { ...next[index], ...value };
        return { ...prev, longTermGoals: next };
      });
    },
    []
  );

  const removeLongTermGoal = useCallback((index: number) => {
    setValues((prev) => ({
      ...prev,
      longTermGoals: prev.longTermGoals.filter((_, i) => i !== index),
    }));
  }, []);

  const addFocusArea = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      focusAreas: [
        ...prev.focusAreas,
        createEmptyDevelopmentPlanListItem("focus"),
      ],
    }));
  }, []);

  const updateFocusArea = useCallback(
    (
      index: number,
      value: Partial<DevelopmentPlanFormValues["focusAreas"][number]>
    ) => {
      setValues((prev) => {
        const next = [...prev.focusAreas];
        next[index] = { ...next[index], ...value };
        return { ...prev, focusAreas: next };
      });
    },
    []
  );

  const removeFocusArea = useCallback((index: number) => {
    setValues((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.filter((_, i) => i !== index),
    }));
  }, []);

  const addMeasurableIndicator = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      measurableIndicators: [
        ...prev.measurableIndicators,
        createEmptyMeasurableIndicator(),
      ],
    }));
  }, []);

  const updateMeasurableIndicator = useCallback(
    (
      index: number,
      value: Partial<DevelopmentPlanFormValues["measurableIndicators"][number]>
    ) => {
      setValues((prev) => {
        const next = [...prev.measurableIndicators];
        next[index] = { ...next[index], ...value };
        return { ...prev, measurableIndicators: next };
      });
    },
    []
  );

  const removeMeasurableIndicator = useCallback((index: number) => {
    setValues((prev) => ({
      ...prev,
      measurableIndicators: prev.measurableIndicators.filter(
        (_, i) => i !== index
      ),
    }));
  }, []);

  const buildContext = useCallback((): DevelopmentPlanCreateContext => {
    if (params.mode === "edit" && params.initialDevelopmentPlan) {
      return {
        playerId: params.initialDevelopmentPlan.playerId,
        disciplineId: params.initialDevelopmentPlan.disciplineId,
        evaluationId: params.initialDevelopmentPlan.evaluationId,
        createdBy: params.initialDevelopmentPlan.createdBy,
      };
    }

    if (!params.playerId || !params.disciplineId || !params.evaluationId) {
      throw new Error(
        "playerId, disciplineId, and evaluationId are required in create mode."
      );
    }

    return {
      playerId: params.playerId,
      disciplineId: params.disciplineId,
      evaluationId: params.evaluationId,
      createdBy: params.createdBy,
    };
  }, [params]);

  const handleSubmit = useCallback(
    async (action: DevelopmentPlanSubmitAction) => {
      setSubmitAction(action);

      const nextErrors = validateDevelopmentPlanForm(values);
      setErrors(nextErrors);

      if (hasDevelopmentPlanFormErrors(nextErrors)) {
        return;
      }

      setIsSubmitting(true);

      try {
        const context = buildContext();
        const payload: DevelopmentPlanFormSubmitPayload =
          serializeDevelopmentPlanFormToPayload(values, context);

        let savedId: string;

        if (params.mode === "edit" && params.initialDevelopmentPlan) {
          const updated = await updateDevelopmentPlanAction(
            db,
            params.initialDevelopmentPlan.id,
            {
              status: payload.status,
              startDate: payload.startDate,
              targetEndDate: payload.targetEndDate,
              documentData: payload.documentData,
            }
          );
          savedId = updated.id;
        } else {
          const created = await createDevelopmentPlanAction(db, payload);
          savedId = created.id;
        }

        if (action === "save-and-routine") {
          params.onSavedAndContinue?.(savedId);
        } else {
          params.onSaved?.(savedId);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [buildContext, params, values]
  );

  return {
    mode: params.mode,
    values,
    errors,
    isSubmitting,
    submitAction,
    setFieldValue,
    addShortTermGoal,
    updateShortTermGoal,
    removeShortTermGoal,
    addLongTermGoal,
    updateLongTermGoal,
    removeLongTermGoal,
    addFocusArea,
    updateFocusArea,
    removeFocusArea,
    addMeasurableIndicator,
    updateMeasurableIndicator,
    removeMeasurableIndicator,
    handleSubmit,
    resetForm,
  };
}
```

---

## `DevelopmentPlanFormProvider.tsx`

```tsx
"use client";

import React, { createContext, useContext, useMemo } from "react";

import type {
  DevelopmentPlanFormContextValue,
  DevelopmentPlanFormProviderProps,
} from "./developmentPlanForm.types";
import { useDevelopmentPlanForm } from "./useDevelopmentPlanForm";

const DevelopmentPlanFormContext =
  createContext<DevelopmentPlanFormContextValue | null>(null);

export function DevelopmentPlanFormProvider({
  mode,
  playerId,
  disciplineId,
  evaluationId,
  createdBy,
  initialDevelopmentPlan,
  onSaved,
  onSavedAndContinue,
  children,
}: DevelopmentPlanFormProviderProps) {
  const form = useDevelopmentPlanForm({
    mode,
    playerId,
    disciplineId,
    evaluationId,
    createdBy,
    initialDevelopmentPlan,
    onSaved,
    onSavedAndContinue,
  });

  const value = useMemo<DevelopmentPlanFormContextValue>(
    () => ({
      mode: form.mode,
      values: form.values,
      errors: form.errors,
      isSubmitting: form.isSubmitting,
      submitAction: form.submitAction,
      setFieldValue: form.setFieldValue,
      addShortTermGoal: form.addShortTermGoal,
      updateShortTermGoal: form.updateShortTermGoal,
      removeShortTermGoal: form.removeShortTermGoal,
      addLongTermGoal: form.addLongTermGoal,
      updateLongTermGoal: form.updateLongTermGoal,
      removeLongTermGoal: form.removeLongTermGoal,
      addFocusArea: form.addFocusArea,
      updateFocusArea: form.updateFocusArea,
      removeFocusArea: form.removeFocusArea,
      addMeasurableIndicator: form.addMeasurableIndicator,
      updateMeasurableIndicator: form.updateMeasurableIndicator,
      removeMeasurableIndicator: form.removeMeasurableIndicator,
      handleSubmit: form.handleSubmit,
      resetForm: form.resetForm,
    }),
    [form]
  );

  return (
    <DevelopmentPlanFormContext.Provider value={value}>
      {children}
    </DevelopmentPlanFormContext.Provider>
  );
}

export function useDevelopmentPlanFormContext() {
  const context = useContext(DevelopmentPlanFormContext);

  if (!context) {
    throw new Error(
      "useDevelopmentPlanFormContext must be used within a DevelopmentPlanFormProvider."
    );
  }

  return context;
}
```

---

A few notes:

- In `useDevelopmentPlanForm.ts`, I import `db` directly just like the evaluation version. If your repo prefers db injection from above, that is the one part to adjust.
- The edit flow only sends fields your `updateDevelopmentPlan` query expects: `status`, `startDate`, `targetEndDate`, `documentData`.
- `summary` is not required in validation right now. `currentPriority` only becomes required-ish when status is `active`.

The next step is the same as before: HeroUI step components for the development plan form.

Below is a HeroUI-based V1 set for the **development plan form step components**, following the same pattern as the evaluation form.

Suggested files:

```text
ui/features/development/forms/development-plan/
  DevelopmentPlanForm.tsx
  DevelopmentPlanFormStepHeader.tsx
  DevelopmentPlanBasicInfoStep.tsx
  DevelopmentPlanOverviewStep.tsx
  DevelopmentPlanShortTermGoalsStep.tsx
  DevelopmentPlanLongTermGoalsStep.tsx
  DevelopmentPlanFocusAreasStep.tsx
  DevelopmentPlanMeasurableIndicatorsStep.tsx
```

---

## `DevelopmentPlanFormStepHeader.tsx`

```tsx
"use client";

import { Chip, Progress } from "@heroui/react";

type DevelopmentPlanFormStepHeaderProps = {
  stepIndex: number;
  totalSteps: number;
  title: string;
  mode: "create" | "edit";
};

export function DevelopmentPlanFormStepHeader({
  stepIndex,
  totalSteps,
  title,
  mode,
}: DevelopmentPlanFormStepHeaderProps) {
  const progressValue = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <div className="border-b px-6 py-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            {mode === "edit" ? "Edit Development Plan" : "New Development Plan"}
          </h2>
          <p className="text-default-500 text-sm">
            Step {stepIndex + 1} of {totalSteps}: {title}
          </p>
        </div>

        <Chip size="sm" variant="flat">
          {title}
        </Chip>
      </div>

      <Progress
        aria-label="Development plan form progress"
        value={progressValue}
        className="max-w-full"
      />
    </div>
  );
}
```

---

## `DevelopmentPlanBasicInfoStep.tsx`

```tsx
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

export function DevelopmentPlanBasicInfoStep() {
  const { values, errors, setFieldValue } = useDevelopmentPlanFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Basic Information</h3>
        <p className="text-default-500 text-sm">
          Set the lifecycle status and timing for this plan.
        </p>
      </CardHeader>

      <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Select
          label="Plan Status"
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

        <div />

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
      </CardBody>
    </Card>
  );
}
```

---

## `DevelopmentPlanOverviewStep.tsx`

```tsx
"use client";

import { Card, CardBody, CardHeader, Textarea } from "@heroui/react";

import { useDevelopmentPlanFormContext } from "./DevelopmentPlanFormProvider";

export function DevelopmentPlanOverviewStep() {
  const { values, errors, setFieldValue } = useDevelopmentPlanFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Plan Overview</h3>
        <p className="text-default-500 text-sm">
          Describe the overall development direction and the most important
          current priority.
        </p>
      </CardHeader>

      <CardBody className="gap-4">
        <Textarea
          label="Plan Summary"
          labelPlacement="outside"
          placeholder="Summarize the intent of this development plan"
          value={values.summary}
          onValueChange={(value) => setFieldValue("summary", value)}
          minRows={6}
        />

        <Textarea
          label="Current Priority"
          labelPlacement="outside"
          placeholder="If only one thing improves this month, what should it be?"
          value={values.currentPriority}
          onValueChange={(value) => setFieldValue("currentPriority", value)}
          minRows={4}
          isInvalid={!!errors.currentPriority}
          errorMessage={errors.currentPriority}
        />
      </CardBody>
    </Card>
  );
}
```

---

## `DevelopmentPlanShortTermGoalsStep.tsx`

```tsx
"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
} from "@heroui/react";

import { useDevelopmentPlanFormContext } from "./DevelopmentPlanFormProvider";

export function DevelopmentPlanShortTermGoalsStep() {
  const {
    values,
    errors,
    addShortTermGoal,
    updateShortTermGoal,
    removeShortTermGoal,
  } = useDevelopmentPlanFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Short-Term Goals</h3>
        <p className="text-default-500 text-sm">
          Add 4–6 week goals that align with the current development focus.
        </p>
      </CardHeader>

      <CardBody className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Short-Term Goal List</p>
            <p className="text-default-500 text-xs">
              Add concise, actionable goals.
            </p>
          </div>

          <Button size="sm" variant="flat" onPress={addShortTermGoal}>
            Add Goal
          </Button>
        </div>

        {values.shortTermGoals.length === 0 ? (
          <div className="rounded-medium text-default-500 border border-dashed px-4 py-6 text-sm">
            No short-term goals added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {values.shortTermGoals.map((goal, index) => (
              <Card key={goal.id} shadow="none" className="border">
                <CardBody className="gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">
                      Short-Term Goal {index + 1}
                    </p>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => removeShortTermGoal(index)}
                    >
                      Remove
                    </Button>
                  </div>

                  <Input
                    label="Title"
                    labelPlacement="outside"
                    value={goal.title}
                    onValueChange={(value) =>
                      updateShortTermGoal(index, { title: value })
                    }
                    placeholder="e.g. Improve strike zone command consistency"
                    isInvalid={!!errors[`shortTermGoals.${index}.title`]}
                    errorMessage={errors[`shortTermGoals.${index}.title`]}
                  />

                  <Textarea
                    label="Description"
                    labelPlacement="outside"
                    value={goal.description}
                    onValueChange={(value) =>
                      updateShortTermGoal(index, { description: value })
                    }
                    placeholder="Optional coaching context"
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
```

---

## `DevelopmentPlanLongTermGoalsStep.tsx`

```tsx
"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
} from "@heroui/react";

import { useDevelopmentPlanFormContext } from "./DevelopmentPlanFormProvider";

export function DevelopmentPlanLongTermGoalsStep() {
  const {
    values,
    errors,
    addLongTermGoal,
    updateLongTermGoal,
    removeLongTermGoal,
  } = useDevelopmentPlanFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Long-Term Goals</h3>
        <p className="text-default-500 text-sm">
          Add bigger directional goals for the season, year, or recruiting
          horizon.
        </p>
      </CardHeader>

      <CardBody className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Long-Term Goal List</p>
            <p className="text-default-500 text-xs">
              Add directional outcomes that guide development.
            </p>
          </div>

          <Button size="sm" variant="flat" onPress={addLongTermGoal}>
            Add Goal
          </Button>
        </div>

        {values.longTermGoals.length === 0 ? (
          <div className="rounded-medium text-default-500 border border-dashed px-4 py-6 text-sm">
            No long-term goals added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {values.longTermGoals.map((goal, index) => (
              <Card key={goal.id} shadow="none" className="border">
                <CardBody className="gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">
                      Long-Term Goal {index + 1}
                    </p>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => removeLongTermGoal(index)}
                    >
                      Remove
                    </Button>
                  </div>

                  <Input
                    label="Title"
                    labelPlacement="outside"
                    value={goal.title}
                    onValueChange={(value) =>
                      updateLongTermGoal(index, { title: value })
                    }
                    placeholder="e.g. Build durable starter profile for summer season"
                    isInvalid={!!errors[`longTermGoals.${index}.title`]}
                    errorMessage={errors[`longTermGoals.${index}.title`]}
                  />

                  <Textarea
                    label="Description"
                    labelPlacement="outside"
                    value={goal.description}
                    onValueChange={(value) =>
                      updateLongTermGoal(index, { description: value })
                    }
                    placeholder="Optional coaching context"
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
```

---

## `DevelopmentPlanFocusAreasStep.tsx`

```tsx
"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
} from "@heroui/react";

import { useDevelopmentPlanFormContext } from "./DevelopmentPlanFormProvider";

export function DevelopmentPlanFocusAreasStep() {
  const { values, errors, addFocusArea, updateFocusArea, removeFocusArea } =
    useDevelopmentPlanFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Focus Areas</h3>
        <p className="text-default-500 text-sm">
          Define the top development priorities this plan is built around.
        </p>
      </CardHeader>

      <CardBody className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Plan Focus Areas</p>
            <p className="text-default-500 text-xs">
              Keep these focused and aligned to the athlete’s current needs.
            </p>
          </div>

          <Button size="sm" variant="flat" onPress={addFocusArea}>
            Add Focus Area
          </Button>
        </div>

        {values.focusAreas.length === 0 ? (
          <div className="rounded-medium text-default-500 border border-dashed px-4 py-6 text-sm">
            No focus areas added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {values.focusAreas.map((focusArea, index) => (
              <Card key={focusArea.id} shadow="none" className="border">
                <CardBody className="gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">
                      Focus Area {index + 1}
                    </p>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => removeFocusArea(index)}
                    >
                      Remove
                    </Button>
                  </div>

                  <Input
                    label="Title"
                    labelPlacement="outside"
                    value={focusArea.title}
                    onValueChange={(value) =>
                      updateFocusArea(index, { title: value })
                    }
                    placeholder="e.g. Improve lower-half direction"
                    isInvalid={!!errors[`focusAreas.${index}.title`]}
                    errorMessage={errors[`focusAreas.${index}.title`]}
                  />

                  <Textarea
                    label="Description"
                    labelPlacement="outside"
                    value={focusArea.description}
                    onValueChange={(value) =>
                      updateFocusArea(index, { description: value })
                    }
                    placeholder="Optional coaching context"
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
```

---

## `DevelopmentPlanMeasurableIndicatorsStep.tsx`

```tsx
"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
} from "@heroui/react";

import { useDevelopmentPlanFormContext } from "./DevelopmentPlanFormProvider";

export function DevelopmentPlanMeasurableIndicatorsStep() {
  const {
    values,
    errors,
    addMeasurableIndicator,
    updateMeasurableIndicator,
    removeMeasurableIndicator,
  } = useDevelopmentPlanFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Measurable Indicators</h3>
        <p className="text-default-500 text-sm">
          Add metrics, behavioral markers, or consistency thresholds that
          support the plan.
        </p>
      </CardHeader>

      <CardBody className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Indicator List</p>
            <p className="text-default-500 text-xs">
              These support coaching judgment and do not replace it.
            </p>
          </div>

          <Button size="sm" variant="flat" onPress={addMeasurableIndicator}>
            Add Indicator
          </Button>
        </div>

        {values.measurableIndicators.length === 0 ? (
          <div className="rounded-medium text-default-500 border border-dashed px-4 py-6 text-sm">
            No measurable indicators added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {values.measurableIndicators.map((indicator, index) => (
              <Card key={indicator.id} shadow="none" className="border">
                <CardBody className="gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">Indicator {index + 1}</p>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => removeMeasurableIndicator(index)}
                    >
                      Remove
                    </Button>
                  </div>

                  <Input
                    label="Title"
                    labelPlacement="outside"
                    value={indicator.title}
                    onValueChange={(value) =>
                      updateMeasurableIndicator(index, { title: value })
                    }
                    placeholder="e.g. 70% strike rate in bullpens"
                    isInvalid={!!errors[`measurableIndicators.${index}.title`]}
                    errorMessage={errors[`measurableIndicators.${index}.title`]}
                  />

                  <Input
                    label="Metric Type"
                    labelPlacement="outside"
                    value={indicator.metricType}
                    onValueChange={(value) =>
                      updateMeasurableIndicator(index, { metricType: value })
                    }
                    placeholder="e.g. objective_metric, behavior_marker, consistency_threshold"
                  />

                  <Textarea
                    label="Description"
                    labelPlacement="outside"
                    value={indicator.description}
                    onValueChange={(value) =>
                      updateMeasurableIndicator(index, { description: value })
                    }
                    placeholder="Optional detail or interpretation notes"
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
```

---

## `DevelopmentPlanForm.tsx`

```tsx
"use client";

import { useMemo, useState } from "react";

import { Button } from "@heroui/react";

import { DevelopmentPlanBasicInfoStep } from "./DevelopmentPlanBasicInfoStep";
import { DevelopmentPlanFocusAreasStep } from "./DevelopmentPlanFocusAreasStep";
import { useDevelopmentPlanFormContext } from "./DevelopmentPlanFormProvider";
import { DevelopmentPlanFormStepHeader } from "./DevelopmentPlanFormStepHeader";
import { DevelopmentPlanLongTermGoalsStep } from "./DevelopmentPlanLongTermGoalsStep";
import { DevelopmentPlanMeasurableIndicatorsStep } from "./DevelopmentPlanMeasurableIndicatorsStep";
import { DevelopmentPlanOverviewStep } from "./DevelopmentPlanOverviewStep";
import { DevelopmentPlanShortTermGoalsStep } from "./DevelopmentPlanShortTermGoalsStep";

type DevelopmentPlanFormProps = {
  onCancel?: () => void;
};

const STEP_TITLES = [
  "Basic Info",
  "Overview",
  "Short-Term Goals",
  "Long-Term Goals",
  "Focus Areas",
  "Measurable Indicators",
] as const;

export function DevelopmentPlanForm({ onCancel }: DevelopmentPlanFormProps) {
  const { mode, isSubmitting, handleSubmit } = useDevelopmentPlanFormContext();
  const [stepIndex, setStepIndex] = useState(0);

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === STEP_TITLES.length - 1;

  const CurrentStep = useMemo(() => {
    switch (stepIndex) {
      case 0:
        return DevelopmentPlanBasicInfoStep;
      case 1:
        return DevelopmentPlanOverviewStep;
      case 2:
        return DevelopmentPlanShortTermGoalsStep;
      case 3:
        return DevelopmentPlanLongTermGoalsStep;
      case 4:
        return DevelopmentPlanFocusAreasStep;
      case 5:
        return DevelopmentPlanMeasurableIndicatorsStep;
      default:
        return DevelopmentPlanBasicInfoStep;
    }
  }, [stepIndex]);

  return (
    <div className="flex h-full flex-col">
      <DevelopmentPlanFormStepHeader
        stepIndex={stepIndex}
        totalSteps={STEP_TITLES.length}
        title={STEP_TITLES[stepIndex]}
        mode={mode}
      />

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <CurrentStep />
      </div>

      <div className="bg-background border-t px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            {!isFirstStep ? (
              <Button
                variant="bordered"
                onPress={() => setStepIndex((prev) => prev - 1)}
                isDisabled={isSubmitting}
              >
                Back
              </Button>
            ) : (
              <Button
                variant="bordered"
                onPress={onCancel}
                isDisabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isLastStep ? (
              <Button
                color="primary"
                onPress={() => setStepIndex((prev) => prev + 1)}
                isDisabled={isSubmitting}
              >
                Next
              </Button>
            ) : (
              <>
                <Button
                  variant="bordered"
                  onPress={() => handleSubmit("save")}
                  isLoading={isSubmitting}
                >
                  {mode === "edit" ? "Save Changes" : "Save Development Plan"}
                </Button>

                {mode === "create" ? (
                  <Button
                    color="primary"
                    onPress={() => handleSubmit("save-and-routine")}
                    isLoading={isSubmitting}
                  >
                    Save and Add Routine
                  </Button>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Notes

A couple of practical notes:

- `summary` is optional in the current validation, so the Overview step won’t block submission unless you decide to tighten it.
- `metricType` is a plain input for V1. You can turn it into a select later once you settle on controlled values.
- Like the evaluation form, this does not yet do step-level validation before moving forward. It validates on submit only, which is simpler for V1.
