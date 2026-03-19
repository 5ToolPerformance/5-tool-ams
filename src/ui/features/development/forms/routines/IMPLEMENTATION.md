Perfect. Since V1 is **plan-owned routines only**, we should simplify the routine form contract a little before generating the files.

## V1 routine decisions

Even though `RoutineDocumentV1` supports `"player" | "universal"`, for this version:

- routines are always associated with a `developmentPlanId`
- routines are effectively **player-specific through the plan**
- global / universal routine authoring is out of scope

So the form should treat these values as fixed on serialize:

- `visibility = "player"`
- `playerId` comes from the linked development plan context if you want it in `documentData`
- `disciplineId` also comes from context, not user input

## Suggested file set

```text
routineForm.types.ts
routineForm.defaults.ts
routineForm.serialization.ts
routineForm.validation.ts
useRoutineForm.ts
RoutineFormProvider.tsx
```

Below is the complete code for those six files.

---

## `routineForm.types.ts`

```ts
import type { RoutineDocumentV1 } from "@/types/development/routines";

export type RoutineType = "partial_lesson" | "full_lesson" | "progression";
export type RoutineFormMode = "create" | "edit";

export type RoutineSubmitAction = "save";

export type RoutineFormMechanic = {
  id: string;
  mechanicId: string;
  title: string;
};

export type RoutineFormDrill = {
  id: string;
  drillId: string;
  title: string;
  notes: string;
  sortOrder: number;
};

export type RoutineFormBlock = {
  id: string;
  title: string;
  notes: string;
  sortOrder: number;
  drills: RoutineFormDrill[];
};

export type RoutineFormValues = {
  title: string;
  description: string;
  routineType: RoutineType;
  sortOrder: number;
  isActive: boolean;

  summary: string;
  usageNotes: string;

  mechanics: RoutineFormMechanic[];
  blocks: RoutineFormBlock[];
};

export type RoutineFormErrorMap = Partial<Record<string, string>>;

export type RoutineFormRecord = {
  id: string;
  developmentPlanId: string;
  createdBy: string;
  title: string;
  description: string | null;
  routineType: RoutineType;
  sortOrder: number;
  isActive: boolean;
  documentData: RoutineDocumentV1 | null;
};

export type RoutineCreateContext = {
  developmentPlanId: string;
  createdBy: string;
  playerId: string;
  disciplineId: string;
};

export type RoutineFormSubmitPayload = {
  developmentPlanId: string;
  createdBy: string;
  title: string;
  description?: string | null;
  routineType: RoutineType;
  sortOrder?: number;
  isActive?: boolean;
  documentData: RoutineDocumentV1;
};

export type RoutineFormContextValue = {
  mode: RoutineFormMode;
  values: RoutineFormValues;
  errors: RoutineFormErrorMap;
  isSubmitting: boolean;
  submitAction: RoutineSubmitAction | null;

  setFieldValue: <K extends keyof RoutineFormValues>(
    key: K,
    value: RoutineFormValues[K]
  ) => void;

  addMechanic: () => void;
  updateMechanic: (index: number, value: Partial<RoutineFormMechanic>) => void;
  removeMechanic: (index: number) => void;

  addBlock: () => void;
  updateBlock: (
    index: number,
    value: Partial<Omit<RoutineFormBlock, "drills">>
  ) => void;
  removeBlock: (index: number) => void;

  addDrillToBlock: (blockIndex: number) => void;
  updateDrillInBlock: (
    blockIndex: number,
    drillIndex: number,
    value: Partial<RoutineFormDrill>
  ) => void;
  removeDrillFromBlock: (blockIndex: number, drillIndex: number) => void;

  handleSubmit: (action: RoutineSubmitAction) => Promise<void>;
  resetForm: () => void;
};

export type RoutineFormProviderProps = {
  mode: RoutineFormMode;
  developmentPlanId?: string;
  createdBy: string;
  playerId?: string;
  disciplineId?: string;
  initialRoutine?: RoutineFormRecord | null;
  onCancel?: () => void;
  onSaved?: (routineId: string) => void;
  children: React.ReactNode;
};
```

---

## `routineForm.defaults.ts`

```ts
import type {
  RoutineFormBlock,
  RoutineFormDrill,
  RoutineFormMechanic,
  RoutineFormRecord,
  RoutineFormValues,
} from "./routineForm.types";

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createEmptyRoutineFormValues(): RoutineFormValues {
  return {
    title: "",
    description: "",
    routineType: "partial_lesson",
    sortOrder: 0,
    isActive: true,

    summary: "",
    usageNotes: "",

    mechanics: [],
    blocks: [],
  };
}

export function createRoutineFormValuesFromRecord(
  routine: RoutineFormRecord
): RoutineFormValues {
  const doc = routine.documentData;

  return {
    title: routine.title ?? "",
    description: routine.description ?? "",
    routineType: routine.routineType,
    sortOrder: routine.sortOrder ?? 0,
    isActive: routine.isActive,

    summary: doc?.overview?.summary ?? "",
    usageNotes: doc?.overview?.usageNotes ?? "",

    mechanics: (doc?.mechanics ?? []).map((item) => ({
      id: createId("mechanic"),
      mechanicId: item.mechanicId ?? "",
      title: item.title ?? "",
    })),

    blocks: (doc?.blocks ?? []).map((block, blockIndex) => ({
      id: block.id ?? createId(`block_${blockIndex}`),
      title: block.title ?? "",
      notes: block.notes ?? "",
      sortOrder: block.sortOrder ?? blockIndex,
      drills: (block.drills ?? []).map((drill, drillIndex) => ({
        id: createId(`drill_${blockIndex}_${drillIndex}`),
        drillId: drill.drillId ?? "",
        title: drill.title ?? "",
        notes: drill.notes ?? "",
        sortOrder: drill.sortOrder ?? drillIndex,
      })),
    })),
  };
}

export function cloneRoutineFormValues(
  values: RoutineFormValues
): RoutineFormValues {
  return {
    ...values,
    mechanics: values.mechanics.map((item) => ({ ...item })),
    blocks: values.blocks.map((block) => ({
      ...block,
      drills: block.drills.map((drill) => ({ ...drill })),
    })),
  };
}

export function createEmptyMechanic(): RoutineFormMechanic {
  return {
    id: createId("mechanic"),
    mechanicId: "",
    title: "",
  };
}

export function createEmptyDrill(sortOrder = 0): RoutineFormDrill {
  return {
    id: createId("drill"),
    drillId: "",
    title: "",
    notes: "",
    sortOrder,
  };
}

export function createEmptyBlock(sortOrder = 0): RoutineFormBlock {
  return {
    id: createId("block"),
    title: "",
    notes: "",
    sortOrder,
    drills: [],
  };
}
```

---

## `routineForm.serialization.ts`

```ts
import type { RoutineDocumentV1 } from "@/types/development/routines";

import type {
  RoutineCreateContext,
  RoutineFormSubmitPayload,
  RoutineFormValues,
} from "./routineForm.types";

function emptyToUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function serializeRoutineFormToDocumentData(
  values: RoutineFormValues,
  context: Pick<RoutineCreateContext, "playerId" | "disciplineId">
): RoutineDocumentV1 {
  const mechanics = values.mechanics
    .filter((item) => item.mechanicId.trim())
    .map((item) => ({
      mechanicId: item.mechanicId.trim(),
      title: emptyToUndefined(item.title),
    }));

  const blocks = values.blocks
    .filter((block) => block.title.trim())
    .map((block, blockIndex) => ({
      id: block.id,
      title: block.title.trim(),
      notes: emptyToUndefined(block.notes),
      sortOrder: block.sortOrder ?? blockIndex,
      drills: block.drills
        .filter((drill) => drill.drillId.trim())
        .map((drill, drillIndex) => ({
          drillId: drill.drillId.trim(),
          title: emptyToUndefined(drill.title),
          notes: emptyToUndefined(drill.notes),
          sortOrder: drill.sortOrder ?? drillIndex,
        })),
    }));

  return {
    version: 1,
    visibility: "player",
    playerId: context.playerId,
    disciplineId: context.disciplineId,
    overview: {
      summary: emptyToUndefined(values.summary),
      usageNotes: emptyToUndefined(values.usageNotes),
    },
    mechanics,
    blocks,
  };
}

export function serializeRoutineFormToPayload(
  values: RoutineFormValues,
  context: RoutineCreateContext
): RoutineFormSubmitPayload {
  return {
    developmentPlanId: context.developmentPlanId,
    createdBy: context.createdBy,
    title: values.title.trim(),
    description: emptyToNull(values.description),
    routineType: values.routineType,
    sortOrder: values.sortOrder,
    isActive: values.isActive,
    documentData: serializeRoutineFormToDocumentData(values, {
      playerId: context.playerId,
      disciplineId: context.disciplineId,
    }),
  };
}
```

---

## `routineForm.validation.ts`

```ts
import type {
  RoutineFormErrorMap,
  RoutineFormValues,
} from "./routineForm.types";

export function validateRoutineForm(
  values: RoutineFormValues
): RoutineFormErrorMap {
  const errors: RoutineFormErrorMap = {};

  if (!values.title.trim()) {
    errors.title = "Routine title is required.";
  }

  if (!values.routineType) {
    errors.routineType = "Routine type is required.";
  }

  if (values.mechanics.length === 0) {
    errors.mechanics = "At least one mechanic is required.";
  }

  values.mechanics.forEach((item, index) => {
    if (!item.mechanicId.trim()) {
      errors[`mechanics.${index}.mechanicId`] = "Mechanic is required.";
    }
  });

  if (values.blocks.length === 0) {
    errors.blocks = "At least one block is required.";
  }

  values.blocks.forEach((block, blockIndex) => {
    if (!block.title.trim()) {
      errors[`blocks.${blockIndex}.title`] = "Block title is required.";
    }

    if (block.drills.length === 0) {
      errors[`blocks.${blockIndex}.drills`] =
        "Each block must contain at least one drill.";
    }

    block.drills.forEach((drill, drillIndex) => {
      if (!drill.drillId.trim()) {
        errors[`blocks.${blockIndex}.drills.${drillIndex}.drillId`] =
          "Drill is required.";
      }
    });
  });

  return errors;
}

export function hasRoutineFormErrors(errors: RoutineFormErrorMap): boolean {
  return Object.keys(errors).length > 0;
}
```

---

## `useRoutineForm.ts`

```ts
import { useCallback, useMemo, useState } from "react";

import { createRoutine as createRoutineAction } from "@/application/routines/createRoutine";
import { updateRoutine as updateRoutineAction } from "@/application/routines/updateRoutine";
import { db } from "@/db";

import {
  cloneRoutineFormValues,
  createEmptyBlock,
  createEmptyDrill,
  createEmptyMechanic,
  createEmptyRoutineFormValues,
  createRoutineFormValuesFromRecord,
} from "./routineForm.defaults";
import { serializeRoutineFormToPayload } from "./routineForm.serialization";
import type {
  RoutineCreateContext,
  RoutineFormErrorMap,
  RoutineFormMode,
  RoutineFormRecord,
  RoutineFormSubmitPayload,
  RoutineFormValues,
  RoutineSubmitAction,
} from "./routineForm.types";
import {
  hasRoutineFormErrors,
  validateRoutineForm,
} from "./routineForm.validation";

type UseRoutineFormParams = {
  mode: RoutineFormMode;
  developmentPlanId?: string;
  createdBy: string;
  playerId?: string;
  disciplineId?: string;
  initialRoutine?: RoutineFormRecord | null;
  onSaved?: (routineId: string) => void;
};

function getInitialValues(params: UseRoutineFormParams): RoutineFormValues {
  if (params.mode === "edit" && params.initialRoutine) {
    return createRoutineFormValuesFromRecord(params.initialRoutine);
  }

  return createEmptyRoutineFormValues();
}

export function useRoutineForm(params: UseRoutineFormParams) {
  const initialValues = useMemo(() => getInitialValues(params), [params]);
  const [values, setValues] = useState<RoutineFormValues>(initialValues);
  const [errors, setErrors] = useState<RoutineFormErrorMap>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAction, setSubmitAction] = useState<RoutineSubmitAction | null>(
    null
  );

  const resetForm = useCallback(() => {
    setValues(cloneRoutineFormValues(initialValues));
    setErrors({});
    setSubmitAction(null);
  }, [initialValues]);

  const setFieldValue = useCallback(
    <K extends keyof RoutineFormValues>(
      key: K,
      value: RoutineFormValues[K]
    ) => {
      setValues((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const addMechanic = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      mechanics: [...prev.mechanics, createEmptyMechanic()],
    }));
  }, []);

  const updateMechanic = useCallback(
    (index: number, value: Partial<RoutineFormValues["mechanics"][number]>) => {
      setValues((prev) => {
        const next = [...prev.mechanics];
        next[index] = { ...next[index], ...value };
        return { ...prev, mechanics: next };
      });
    },
    []
  );

  const removeMechanic = useCallback((index: number) => {
    setValues((prev) => ({
      ...prev,
      mechanics: prev.mechanics.filter((_, i) => i !== index),
    }));
  }, []);

  const addBlock = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      blocks: [...prev.blocks, createEmptyBlock(prev.blocks.length)],
    }));
  }, []);

  const updateBlock = useCallback(
    (
      index: number,
      value: Partial<Omit<RoutineFormValues["blocks"][number], "drills">>
    ) => {
      setValues((prev) => {
        const next = [...prev.blocks];
        next[index] = { ...next[index], ...value };
        return { ...prev, blocks: next };
      });
    },
    []
  );

  const removeBlock = useCallback((index: number) => {
    setValues((prev) => ({
      ...prev,
      blocks: prev.blocks
        .filter((_, i) => i !== index)
        .map((block, i) => ({ ...block, sortOrder: i })),
    }));
  }, []);

  const addDrillToBlock = useCallback((blockIndex: number) => {
    setValues((prev) => {
      const nextBlocks = [...prev.blocks];
      const block = nextBlocks[blockIndex];
      const nextDrills = [
        ...block.drills,
        createEmptyDrill(block.drills.length),
      ];
      nextBlocks[blockIndex] = { ...block, drills: nextDrills };
      return { ...prev, blocks: nextBlocks };
    });
  }, []);

  const updateDrillInBlock = useCallback(
    (
      blockIndex: number,
      drillIndex: number,
      value: Partial<RoutineFormValues["blocks"][number]["drills"][number]>
    ) => {
      setValues((prev) => {
        const nextBlocks = [...prev.blocks];
        const block = nextBlocks[blockIndex];
        const nextDrills = [...block.drills];
        nextDrills[drillIndex] = { ...nextDrills[drillIndex], ...value };
        nextBlocks[blockIndex] = { ...block, drills: nextDrills };
        return { ...prev, blocks: nextBlocks };
      });
    },
    []
  );

  const removeDrillFromBlock = useCallback(
    (blockIndex: number, drillIndex: number) => {
      setValues((prev) => {
        const nextBlocks = [...prev.blocks];
        const block = nextBlocks[blockIndex];
        const nextDrills = block.drills
          .filter((_, i) => i !== drillIndex)
          .map((drill, i) => ({ ...drill, sortOrder: i }));
        nextBlocks[blockIndex] = { ...block, drills: nextDrills };
        return { ...prev, blocks: nextBlocks };
      });
    },
    []
  );

  const buildContext = useCallback((): RoutineCreateContext => {
    if (!params.developmentPlanId || !params.playerId || !params.disciplineId) {
      throw new Error(
        "developmentPlanId, playerId, and disciplineId are required for routine form."
      );
    }

    return {
      developmentPlanId: params.developmentPlanId,
      createdBy: params.createdBy,
      playerId: params.playerId,
      disciplineId: params.disciplineId,
    };
  }, [params]);

  const handleSubmit = useCallback(
    async (action: RoutineSubmitAction) => {
      setSubmitAction(action);

      const nextErrors = validateRoutineForm(values);
      setErrors(nextErrors);

      if (hasRoutineFormErrors(nextErrors)) {
        return;
      }

      setIsSubmitting(true);

      try {
        const context = buildContext();
        const payload: RoutineFormSubmitPayload = serializeRoutineFormToPayload(
          values,
          context
        );

        let savedId: string;

        if (params.mode === "edit" && params.initialRoutine) {
          const updated = await updateRoutineAction(
            db,
            params.initialRoutine.id,
            {
              title: payload.title,
              description: payload.description,
              routineType: payload.routineType,
              sortOrder: payload.sortOrder,
              isActive: payload.isActive,
              documentData: payload.documentData,
              developmentPlanId: context.developmentPlanId,
              createdBy: context.createdBy,
            }
          );
          savedId = updated.id;
        } else {
          const created = await createRoutineAction(db, payload);
          savedId = created.id;
        }

        params.onSaved?.(savedId);
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
    addMechanic,
    updateMechanic,
    removeMechanic,
    addBlock,
    updateBlock,
    removeBlock,
    addDrillToBlock,
    updateDrillInBlock,
    removeDrillFromBlock,
    handleSubmit,
    resetForm,
  };
}
```

---

## `RoutineFormProvider.tsx`

```tsx
"use client";

import React, { createContext, useContext, useMemo } from "react";

import type {
  RoutineFormContextValue,
  RoutineFormProviderProps,
} from "./routineForm.types";
import { useRoutineForm } from "./useRoutineForm";

const RoutineFormContext = createContext<RoutineFormContextValue | null>(null);

export function RoutineFormProvider({
  mode,
  developmentPlanId,
  createdBy,
  playerId,
  disciplineId,
  initialRoutine,
  onSaved,
  children,
}: RoutineFormProviderProps) {
  const form = useRoutineForm({
    mode,
    developmentPlanId,
    createdBy,
    playerId,
    disciplineId,
    initialRoutine,
    onSaved,
  });

  const value = useMemo<RoutineFormContextValue>(
    () => ({
      mode: form.mode,
      values: form.values,
      errors: form.errors,
      isSubmitting: form.isSubmitting,
      submitAction: form.submitAction,
      setFieldValue: form.setFieldValue,
      addMechanic: form.addMechanic,
      updateMechanic: form.updateMechanic,
      removeMechanic: form.removeMechanic,
      addBlock: form.addBlock,
      updateBlock: form.updateBlock,
      removeBlock: form.removeBlock,
      addDrillToBlock: form.addDrillToBlock,
      updateDrillInBlock: form.updateDrillInBlock,
      removeDrillFromBlock: form.removeDrillFromBlock,
      handleSubmit: form.handleSubmit,
      resetForm: form.resetForm,
    }),
    [form]
  );

  return (
    <RoutineFormContext.Provider value={value}>
      {children}
    </RoutineFormContext.Provider>
  );
}

export function useRoutineFormContext() {
  const context = useContext(RoutineFormContext);

  if (!context) {
    throw new Error(
      "useRoutineFormContext must be used within a RoutineFormProvider."
    );
  }

  return context;
}
```

---

A few implementation notes:

- Since V1 has no global routines, the form does **not** expose visibility switching. Serialization hardcodes `visibility: "player"`.

Below is a HeroUI-based V1 set for the **routine form step components**, following the same pattern as evaluation and development plans.

Suggested files:

```text
ui/features/development/forms/routine/
  RoutineForm.tsx
  RoutineFormStepHeader.tsx
  RoutineBasicInfoStep.tsx
  RoutineOverviewStep.tsx
  RoutineMechanicsStep.tsx
  RoutineBlocksStep.tsx
```

---

## `RoutineFormStepHeader.tsx`

```tsx
"use client";

import { Chip, Progress } from "@heroui/react";

type RoutineFormStepHeaderProps = {
  stepIndex: number;
  totalSteps: number;
  title: string;
  mode: "create" | "edit";
};

export function RoutineFormStepHeader({
  stepIndex,
  totalSteps,
  title,
  mode,
}: RoutineFormStepHeaderProps) {
  const progressValue = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <div className="border-b px-6 py-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            {mode === "edit" ? "Edit Routine" : "New Routine"}
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
        aria-label="Routine form progress"
        value={progressValue}
        className="max-w-full"
      />
    </div>
  );
}
```

---

## `RoutineBasicInfoStep.tsx`

```tsx
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
  const { values, errors, setFieldValue } = useRoutineFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Basic Information</h3>
        <p className="text-default-500 text-sm">
          Define the routine’s basic identity and availability.
        </p>
      </CardHeader>

      <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              setFieldValue(
                "routineType",
                selected as typeof values.routineType
              );
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
```

---

## `RoutineOverviewStep.tsx`

```tsx
"use client";

import { Card, CardBody, CardHeader, Textarea } from "@heroui/react";

import { useRoutineFormContext } from "./RoutineFormProvider";

export function RoutineOverviewStep() {
  const { values, setFieldValue } = useRoutineFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Overview</h3>
        <p className="text-default-500 text-sm">
          Summarize what this routine is for and how coaches should use it.
        </p>
      </CardHeader>

      <CardBody className="gap-4">
        <Textarea
          label="Summary"
          labelPlacement="outside"
          placeholder="What does this routine target?"
          value={values.summary}
          onValueChange={(value) => setFieldValue("summary", value)}
          minRows={5}
        />

        <Textarea
          label="Usage Notes"
          labelPlacement="outside"
          placeholder="How should coaches use or apply this routine?"
          value={values.usageNotes}
          onValueChange={(value) => setFieldValue("usageNotes", value)}
          minRows={5}
        />
      </CardBody>
    </Card>
  );
}
```

---

## `RoutineMechanicsStep.tsx`

```tsx
"use client";

import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";

import { useRoutineFormContext } from "./RoutineFormProvider";

export function RoutineMechanicsStep() {
  const { values, errors, addMechanic, updateMechanic, removeMechanic } =
    useRoutineFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Mechanics</h3>
        <p className="text-default-500 text-sm">
          Add the mechanics this routine is intended to address.
        </p>
      </CardHeader>

      <CardBody className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Mechanic List</p>
            <p className="text-default-500 text-xs">
              At least one mechanic is required.
            </p>
          </div>

          <Button size="sm" variant="flat" onPress={addMechanic}>
            Add Mechanic
          </Button>
        </div>

        {errors.mechanics ? (
          <p className="text-danger text-sm">{errors.mechanics}</p>
        ) : null}

        {values.mechanics.length === 0 ? (
          <div className="rounded-medium text-default-500 border border-dashed px-4 py-6 text-sm">
            No mechanics added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {values.mechanics.map((mechanic, index) => (
              <Card key={mechanic.id} shadow="none" className="border">
                <CardBody className="gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">Mechanic {index + 1}</p>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => removeMechanic(index)}
                    >
                      Remove
                    </Button>
                  </div>

                  <Input
                    label="Mechanic ID"
                    labelPlacement="outside"
                    value={mechanic.mechanicId}
                    onValueChange={(value) =>
                      updateMechanic(index, { mechanicId: value })
                    }
                    placeholder="Replace with select/autocomplete later"
                    isInvalid={!!errors[`mechanics.${index}.mechanicId`]}
                    errorMessage={errors[`mechanics.${index}.mechanicId`]}
                  />

                  <Input
                    label="Mechanic Title"
                    labelPlacement="outside"
                    value={mechanic.title}
                    onValueChange={(value) =>
                      updateMechanic(index, { title: value })
                    }
                    placeholder="Optional title snapshot"
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

## `RoutineBlocksStep.tsx`

```tsx
"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Textarea,
} from "@heroui/react";

import { useRoutineFormContext } from "./RoutineFormProvider";

export function RoutineBlocksStep() {
  const {
    values,
    errors,
    addBlock,
    updateBlock,
    removeBlock,
    addDrillToBlock,
    updateDrillInBlock,
    removeDrillFromBlock,
  } = useRoutineFormContext();

  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h3 className="text-base font-semibold">Blocks & Drills</h3>
        <p className="text-default-500 text-sm">
          Build the routine structure by creating blocks and adding drills
          inside each block.
        </p>
      </CardHeader>

      <CardBody className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Routine Blocks</p>
            <p className="text-default-500 text-xs">
              Each block should have a title and at least one drill.
            </p>
          </div>

          <Button size="sm" variant="flat" onPress={addBlock}>
            Add Block
          </Button>
        </div>

        {errors.blocks ? (
          <p className="text-danger text-sm">{errors.blocks}</p>
        ) : null}

        {values.blocks.length === 0 ? (
          <div className="rounded-medium text-default-500 border border-dashed px-4 py-6 text-sm">
            No blocks added yet.
          </div>
        ) : (
          <div className="space-y-5">
            {values.blocks.map((block, blockIndex) => (
              <Card key={block.id} shadow="none" className="border">
                <CardBody className="gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">
                      Block {blockIndex + 1}
                    </p>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => removeBlock(blockIndex)}
                    >
                      Remove Block
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                      label="Block Title"
                      labelPlacement="outside"
                      value={block.title}
                      onValueChange={(value) =>
                        updateBlock(blockIndex, { title: value })
                      }
                      placeholder="e.g. Warm-Up Prep"
                      isInvalid={!!errors[`blocks.${blockIndex}.title`]}
                      errorMessage={errors[`blocks.${blockIndex}.title`]}
                    />

                    <Input
                      type="number"
                      label="Block Sort Order"
                      labelPlacement="outside"
                      value={String(block.sortOrder)}
                      onValueChange={(value) =>
                        updateBlock(blockIndex, {
                          sortOrder: Number.isNaN(Number(value))
                            ? block.sortOrder
                            : Number(value),
                        })
                      }
                      min={0}
                    />
                  </div>

                  <Textarea
                    label="Block Notes"
                    labelPlacement="outside"
                    value={block.notes}
                    onValueChange={(value) =>
                      updateBlock(blockIndex, { notes: value })
                    }
                    placeholder="Optional coaching notes for this block"
                    minRows={3}
                  />

                  <Divider />

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">Drills</p>
                      <p className="text-default-500 text-xs">
                        Add the drills that belong inside this block.
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="flat"
                      onPress={() => addDrillToBlock(blockIndex)}
                    >
                      Add Drill
                    </Button>
                  </div>

                  {errors[`blocks.${blockIndex}.drills`] ? (
                    <p className="text-danger text-sm">
                      {errors[`blocks.${blockIndex}.drills`]}
                    </p>
                  ) : null}

                  {block.drills.length === 0 ? (
                    <div className="rounded-medium text-default-500 border border-dashed px-4 py-6 text-sm">
                      No drills added to this block yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {block.drills.map((drill, drillIndex) => (
                        <Card
                          key={drill.id}
                          shadow="none"
                          className="bg-default-50 border"
                        >
                          <CardBody className="gap-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-medium">
                                Drill {drillIndex + 1}
                              </p>
                              <Button
                                color="danger"
                                variant="light"
                                onPress={() =>
                                  removeDrillFromBlock(blockIndex, drillIndex)
                                }
                              >
                                Remove Drill
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <Input
                                label="Drill ID"
                                labelPlacement="outside"
                                value={drill.drillId}
                                onValueChange={(value) =>
                                  updateDrillInBlock(blockIndex, drillIndex, {
                                    drillId: value,
                                  })
                                }
                                placeholder="Replace with select/autocomplete later"
                                isInvalid={
                                  !!errors[
                                    `blocks.${blockIndex}.drills.${drillIndex}.drillId`
                                  ]
                                }
                                errorMessage={
                                  errors[
                                    `blocks.${blockIndex}.drills.${drillIndex}.drillId`
                                  ]
                                }
                              />

                              <Input
                                label="Drill Title"
                                labelPlacement="outside"
                                value={drill.title}
                                onValueChange={(value) =>
                                  updateDrillInBlock(blockIndex, drillIndex, {
                                    title: value,
                                  })
                                }
                                placeholder="Optional title snapshot"
                              />

                              <Input
                                type="number"
                                label="Drill Sort Order"
                                labelPlacement="outside"
                                value={String(drill.sortOrder)}
                                onValueChange={(value) =>
                                  updateDrillInBlock(blockIndex, drillIndex, {
                                    sortOrder: Number.isNaN(Number(value))
                                      ? drill.sortOrder
                                      : Number(value),
                                  })
                                }
                                min={0}
                              />
                            </div>

                            <Textarea
                              label="Drill Notes"
                              labelPlacement="outside"
                              value={drill.notes}
                              onValueChange={(value) =>
                                updateDrillInBlock(blockIndex, drillIndex, {
                                  notes: value,
                                })
                              }
                              placeholder="Optional drill notes"
                              minRows={3}
                            />
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  )}
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

## `RoutineForm.tsx`

```tsx
"use client";

import { useMemo, useState } from "react";

import { Button } from "@heroui/react";

import { RoutineBasicInfoStep } from "./RoutineBasicInfoStep";
import { RoutineBlocksStep } from "./RoutineBlocksStep";
import { useRoutineFormContext } from "./RoutineFormProvider";
import { RoutineFormStepHeader } from "./RoutineFormStepHeader";
import { RoutineMechanicsStep } from "./RoutineMechanicsStep";
import { RoutineOverviewStep } from "./RoutineOverviewStep";

type RoutineFormProps = {
  onCancel?: () => void;
};

const STEP_TITLES = [
  "Basic Info",
  "Overview",
  "Mechanics",
  "Blocks & Drills",
] as const;

export function RoutineForm({ onCancel }: RoutineFormProps) {
  const { mode, isSubmitting, handleSubmit } = useRoutineFormContext();
  const [stepIndex, setStepIndex] = useState(0);

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === STEP_TITLES.length - 1;

  const CurrentStep = useMemo(() => {
    switch (stepIndex) {
      case 0:
        return RoutineBasicInfoStep;
      case 1:
        return RoutineOverviewStep;
      case 2:
        return RoutineMechanicsStep;
      case 3:
        return RoutineBlocksStep;
      default:
        return RoutineBasicInfoStep;
    }
  }, [stepIndex]);

  return (
    <div className="flex h-full flex-col">
      <RoutineFormStepHeader
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
              <Button
                color="primary"
                onPress={() => handleSubmit("save")}
                isLoading={isSubmitting}
              >
                {mode === "edit" ? "Save Changes" : "Save Routine"}
              </Button>
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

A few intentional V1 choices here:

- `mechanicId` and `drillId` are plain inputs for now, just like the earlier forms. These can become autocomplete/select components later.
- The routine flow is kept to 4 steps to avoid overcomplicating authoring.
- Validation still happens on final submit, not on step transitions.
- Since V1 has no universal routines, there is no visibility toggle in the UI.

The next logical step is wiring the routine form into the “Save and Add Routine” flow from the development plan drawer so the chained transition feels complete.
