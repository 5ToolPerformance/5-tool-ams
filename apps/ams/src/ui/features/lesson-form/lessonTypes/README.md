# Adding a New Lesson Type to the Lesson Form

This document explains **exactly how to add a new lesson type–specific section** to the Lesson Creation Form (e.g. Pitching, Hitting, Fielding).

It is written so that a developer with **no prior context** can follow it end-to-end without breaking the form architecture.

---

## High-Level Architecture (Read This First)

The lesson form is a **multi-step workflow** powered by **TanStack React Form** and a **lesson-type plugin system**.

Key principles:

- The form captures **user intent**, not database rows
- Lesson types are implemented as **isolated plugins**
- Adding a new lesson type should:
  - NOT require editing the stepper
  - NOT require editing other lesson types
  - NOT require schema rewrites

If you follow this guide, new lesson types are **additive**, not invasive.

---

## Where Lesson Types Live

All lesson-type logic lives here:

```

ui/features/lesson-form/lessonTypes/

```

Each lesson type is:

- One self-contained file
- Registered in a central registry
- Responsible for its own UI and mechanic filtering

---

## Step-by-Step: Adding a New Lesson Type

We’ll use **Hitting** as an example.

---

## Step 1: Define the Data Shape (Form Types)

Lesson-type–specific data always lives under:

```

players[playerId].lessonSpecific.<lessonType>

```

### File

```

hooks/lesson/lessonForm.types.ts

```

### Add a new data type

```ts
export type HittingLessonData = {
  focus?: "tee" | "front-toss" | "live";
  swingCount?: number;
  intentPercent?: number;
};
```

### Attach it to `PlayerLessonData`

```ts
export type PlayerLessonData = {
  notes?: string;

  mechanics?: Record<
    string,
    {
      notes?: string;
    }
  >;

  lessonSpecific?: {
    pitching?: PitchingLessonData;
    hitting?: HittingLessonData; // ← NEW
  };

  videoAssetId?: string;
};
```

**Rules:**

- Everything is optional (no default-value hell)
- Lesson-specific data is namespaced
- Do NOT flatten this structure

---

## Step 2: Implement the Lesson Type Plugin

Each lesson type implements the same contract.

### File

```
ui/features/lesson-form/lessonTypes/hitting.tsx
```

### Implementation

```tsx
"use client";

import { useLessonFormContext } from "../LessonFormProvider";
import { LessonTypeImplementation } from "./lessonTypes";

const HITTING_FOCUS = [
  { value: "tee", label: "Tee Work" },
  { value: "front-toss", label: "Front Toss" },
  { value: "live", label: "Live" },
] as const;

export const HittingLesson: LessonTypeImplementation = {
  type: "hitting",
  label: "Hitting",

  // Used to filter mechanics
  allowedMechanicTypes: ["hitting"],

  PlayerNotes({ playerId }) {
    const { form } = useLessonFormContext();

    return (
      <div style={{ marginTop: 12 }}>
        <h4>Hitting Details</h4>

        <label>
          Focus
          <select
            onChange={(e) =>
              form.setFieldValue(
                `players.${playerId}.lessonSpecific.hitting.focus`,
                e.target.value as "tee" | "front-toss" | "live"
              )
            }
            defaultValue=""
          >
            <option value="" disabled>
              Select focus
            </option>
            {HITTING_FOCUS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Swing Count
          <input
            type="number"
            min={0}
            onChange={(e) =>
              form.setFieldValue(
                `players.${playerId}.lessonSpecific.hitting.swingCount`,
                Number(e.target.value)
              )
            }
          />
        </label>

        <label>
          Intent Level (%)
          <input
            type="number"
            min={0}
            max={100}
            onChange={(e) =>
              form.setFieldValue(
                `players.${playerId}.lessonSpecific.hitting.intentPercent`,
                Number(e.target.value)
              )
            }
          />
        </label>
      </div>
    );
  },
};
```

**Rules:**

- Do NOT subscribe here (`form.Subscribe` happens higher up)
- Do NOT initialize structure here
- Do NOT handle validation here
- Only write to your lesson namespace

---

## Step 3: Register the Lesson Type

All lesson types must be registered in one place.

### File

```
ui/features/lesson-form/lessonTypes/index.ts
```

### Add the new lesson

```ts
import { HittingLesson } from "./hitting";
import { PitchingLesson } from "./pitching";

export const LESSON_TYPE_REGISTRY = {
  pitching: PitchingLesson,
  hitting: HittingLesson, // ← NEW
};
```

That’s it.

No other files need to be touched.

---

## Step 4: Mechanics Filtering (Automatic)

Mechanics are filtered automatically based on:

```ts
allowedMechanicTypes;
```

### Mechanics table requirement

Your mechanics data must include a `type` column:

```ts
type Mechanic = {
  id: string;
  name: string;
  type: "pitching" | "hitting" | "fielding";
};
```

The form will automatically:

- show only relevant mechanics
- hide irrelevant ones
- preserve per-mechanic notes

No additional work required.

---

## Step 5: Submission (Already Supported)

On submit, lesson-specific data is accessed like this:

```ts
const lessonType = values.lessonType;

const perPlayerData = values.players[playerId].lessonSpecific?.[lessonType];
```

No conditionals.
No branching.
No cleanup required.

---

## Common Mistakes to Avoid

❌ Adding conditionals to `StepPlayerNotes`
❌ Adding lesson logic to the stepper
❌ Storing lesson data outside `lessonSpecific`
❌ Initializing lesson-specific defaults globally
❌ Using arrays when metadata is needed

If you feel the urge to do any of these, stop — the plugin system already supports what you need.

---

## Mental Model (Very Important)

- **Steps** render UI
- **Lesson types** define behavior
- **Form hook** owns workflow
- **Submission** normalizes intent → DB

If a change doesn’t fit one of those categories, it’s probably in the wrong place.

---

## Checklist: New Lesson Type Done Correctly

- [ ] Data shape added to `lessonForm.types.ts`
- [ ] Lesson plugin created in `lessonTypes/`
- [ ] Plugin registered in `LESSON_TYPE_REGISTRY`
- [ ] Mechanics filtered via `allowedMechanicTypes`
- [ ] No step or provider changes made

If all boxes are checked, the lesson type is production-ready.

---

## Final Notes

This system was designed so that **lesson types can be added confidently without regressions**.

If implemented correctly:

- existing lesson types will not break
- form steps will not need modification
- submission logic remains stable

This is intentional.

When in doubt: **follow the Pitching implementation exactly**.
