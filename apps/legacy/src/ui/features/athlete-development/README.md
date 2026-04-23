# Player Profile Development Tab Implementation Plan

Build a new **Development** tab on the player profile that displays the athlete’s development context for the currently selected discipline. Do **not** implement forms in this task. This task is display-only and should establish the page structure, data loading, empty states, and action entry points.

Codex should reference:

- the structure and patterns used by the existing player profile tabs
- the existing lesson cards for discipline-specific color treatment
- the current query / application layering conventions in the repo
- the existing player profile routing and tab navigation patterns

## Goal

Create a Development tab that helps a coach quickly understand:

- the latest evaluation for the current discipline
- the active development plan for the current discipline
- the routines available to this athlete for the current discipline
- the relevant history of evaluations and development plans

This should feel like a **coach workflow dashboard**, not a raw admin CRUD page.

---

# Scope

## In scope

- add a Development tab to the player profile
- build read-only display sections for:

  - Current Snapshot
  - Active Plan
  - Routines
  - History

- wire the tab to existing or newly created minimal read queries
- show empty states where no data exists
- add action buttons / links for future form flows, but do not implement the forms
- use discipline-aware styling similar to existing lesson cards

## Out of scope

- creating or editing evaluations
- creating or editing development plans
- creating or editing routines
- lesson logging changes
- routine-to-lesson parsing
- comparing documents across time
- assignment / progression tracking UI
- any write flows beyond placeholder navigation hooks

---

# UX structure

The Development tab should be structured as a stacked dashboard with four sections.

## 1. Current Snapshot

Purpose:

- quickly communicate the athlete’s current development context for the selected discipline

Display:

- latest evaluation date
- evaluation type
- phase
- snapshot summary
- strength profile summary
- key constraints summary
- optional document-based summary data if available in `documentData`

Actions:

- New Evaluation
- New Development Plan
- New Routine

Behavior:

- if no evaluation exists, show an empty state explaining that an evaluation is needed before a development plan can be created

---

## 2. Active Plan

Purpose:

- show the current active development plan for the selected discipline

Display:

- active plan status
- start date / target end date
- source evaluation date if available
- key summary content from `documentData`
- focus / priority summary if present in `documentData`

Actions:

- View Plan
- Edit Plan
- Create Routine

Behavior:

- if no active plan exists, show an empty state
- if evaluations exist but no active plan exists, promote “Create Plan from Latest Evaluation”

---

## 3. Routines

Purpose:

- show routines available for this athlete and discipline

Split into two groups:

### Player Routines

- routines belonging to the player’s active development context

### Universal Routines

- routines not specific to this player but usable within the same discipline

Display per routine:

- title
- description
- routine type
- active/inactive state
- high-level mechanic summary if available in `documentData`
- block count if available from `documentData`

Actions:

- View Routine
- Edit Routine
- Use in Lesson

Behavior:

- if there are no routines, show an empty state with actions to create a routine or browse universal routines

Note:
If universal routines are not yet modeled cleanly in the backend, build the section scaffold and populate only player routines for now, leaving a clearly marked TODO.

---

## 4. History

Purpose:

- show prior evaluations and development plans for the current discipline

Subsections:

### Evaluation History

Display:

- date
- type
- phase
- short summary
- created by if easily available

Actions:

- View
- Edit
- Create Plan from This

### Development Plan History

Display:

- status
- start / end dates
- short summary from `documentData`

Actions:

- View
- Edit
- Activate later if such a flow exists, otherwise do not add yet

Behavior:

- compact list or cards, not giant full-detail renderings

---

# Discipline scoping

The Development tab should be discipline-scoped.

Codex should follow the same discipline selection / context pattern used elsewhere in the player profile if it already exists. If no existing discipline selector pattern exists, build the tab to consume the current profile discipline context rather than introducing a new independent discipline state.

All queries and displayed data should be filtered by the current discipline.

---

# Data requirements

This tab only needs read models.

Codex should build or reuse the minimum read surface necessary to populate the page.

## Required reads

### Latest evaluation for player + discipline

Needed for:

- Current Snapshot
- create-plan empty state logic

### Evaluation history for player + discipline

Needed for:

- History section

### Active development plan for player + discipline

Needed for:

- Active Plan
- routines context

### Development plan history for player + discipline

Needed for:

- History section

### Routines for the player’s active plan

Needed for:

- Player Routines section

### Universal routines for discipline

Needed for:

- Universal Routines section if currently feasible

---

# Suggested backend query shape

Use the minimal document-style queries already implemented.

If missing, Codex should add only these read queries:

## Evaluations

- `getEvaluationsForPlayer(db, { playerId, disciplineId, limit? })`
- helper in application or UI composition to select latest evaluation

## Development plans

- `getActiveDevelopmentPlanForPlayerDiscipline(db, { playerId, disciplineId })`
- `getDevelopmentPlansForPlayer(db, { playerId, disciplineId, limit? })`

## Routines

- `getRoutinesForDevelopmentPlan(db, developmentPlanId)`

## Optional universal routines

If supported by current data model, add:

- `getUniversalRoutinesForDiscipline(db, disciplineId)`

If not supported cleanly yet, stub the section and leave a TODO comment.

---

# Application layer guidance

Keep application logic thin and focused on assembling the page data.

Codex should create a lightweight application-level read model function if helpful, for example:

- `getPlayerDevelopmentTabData`

This function should gather:

- latest evaluation
- evaluation history
- active plan
- plan history
- routines for active plan
- universal routines if available

Return a single shape tailored to the page.

This is preferred over making the UI perform many unrelated data fetches itself if the repo already favors assembled read models.

Example response shape:

```ts
type PlayerDevelopmentTabData = {
  disciplineId: string;
  latestEvaluation: EvaluationRow | null;
  evaluationHistory: EvaluationRow[];
  activePlan: DevelopmentPlanRow | null;
  developmentPlanHistory: DevelopmentPlanRow[];
  playerRoutines: RoutineRow[];
  universalRoutines: RoutineRow[];
};
```

---

# UI implementation guidance

## File placement

Codex should follow the existing player profile feature structure and tab conventions.

Likely add a feature folder such as:

```text
ui/features/players/profile/development/
```

Suggested components:

```text
DevelopmentTab.tsx
CurrentSnapshotPanel.tsx
ActivePlanPanel.tsx
RoutinesPanel.tsx
DevelopmentHistoryPanel.tsx
EvaluationSummaryCard.tsx
DevelopmentPlanSummaryCard.tsx
RoutineSummaryCard.tsx
DevelopmentEmptyState.tsx
```

Codex should adapt names to the repo’s actual component naming conventions.

---

## Layout guidance

Use stacked sections with clear spacing and discipline-aware card styling.

Reference existing lesson cards for:

- discipline color accents
- card borders / backgrounds
- status chips if they already exist
- typography hierarchy

Do not invent a separate design language.

Preferred section order:

1. Current Snapshot
2. Active Plan
3. Routines
4. History

---

## Card behavior

Cards should be concise, not full document renderers.

### Evaluation card

Show:

- date
- type
- phase
- 2–3 summary fields max

### Development plan card

Show:

- status
- dates
- high-level summary from `documentData`

### Routine card

Show:

- title
- routine type
- description
- a few document-derived metadata chips if available

Avoid rendering raw JSON or overly deep document structures.

---

# `documentData` usage rules

The tab should use `documentData` opportunistically, not depend on it being perfect.

## Evaluations

Read from:

- relational fields first:

  - snapshotSummary
  - strengthProfileSummary
  - keyConstraintsSummary

- optionally read additional summary items from `documentData`

## Development plans

Read most display content from `documentData` where available
Fallback gracefully if keys are missing

## Routines

Read block count / mechanic summary / usage summary from `documentData` where available
Fallback to basic row fields

Codex should implement defensive parsing helpers rather than inline deep property access everywhere.

Suggested helper pattern:

- small functions that derive display-friendly values from `documentData`

Examples:

- `getRoutineBlockCount(documentData)`
- `getRoutineMechanicPreview(documentData)`
- `getPlanSummary(documentData)`

---

# Empty states

Every section should have thoughtful empty states.

## No evaluations

Message:

- no evaluation exists yet for this discipline

Actions:

- New Evaluation

## No active plan

Message:

- no active development plan exists

Actions:

- if latest evaluation exists: Create Plan from Latest Evaluation
- otherwise: New Evaluation

## No routines

Message:

- no routines available for this discipline / athlete

Actions:

- New Routine
- Browse Universal Routines if applicable

## No history

Show a compact empty state rather than leaving blank space

---

# Action buttons

Buttons can route to future destinations, even if those pages are not built yet.

Codex should add buttons / links for:

- New Evaluation
- New Development Plan
- New Routine
- View
- Edit
- Use in Lesson
- Create Plan from Evaluation

Use existing route conventions if they already exist. If routes are not yet defined, use placeholder hrefs or TODO comments consistent with repo standards.

Do not implement the forms in this task.

---

# Technical guidance for Codex

## 1. Reuse existing tab shell patterns

Do not invent a custom player tab wrapper.

## 2. Keep data loading consistent with the rest of the profile

If the profile uses server components for top-level data loading, follow that pattern.
If it uses application-layer aggregators, follow that pattern.

## 3. Prefer one assembled read model for the page

This will simplify the UI and avoid repeated parsing logic.

## 4. Add parsing helpers for `documentData`

Do not scatter raw JSON access across components.

## 5. Keep components presentational where possible

Push shaping logic into helper functions or the page-level read model.

## 6. Use HeroUI where applicable

Use HeroUI for scroll shadows, cards, tables, etc.

---

# Acceptance criteria

Codex is done when:

- the player profile includes a new Development tab
- the tab renders correctly within the existing profile tab system
- the page is discipline-scoped
- the tab displays:

  - latest evaluation summary
  - active development plan summary
  - routines section
  - evaluation and plan history

- empty states render correctly when data is missing
- action buttons / links are present for future workflows
- styling visually aligns with the current player profile and lesson-card discipline colors
- no forms are implemented
- no lesson rewrite is attempted

---

# Suggested implementation order

## Phase 1: data composition

- inspect existing profile tab architecture
- inspect lesson cards for discipline-aware visual tokens
- add or confirm required read queries
- create application-level read model for the Development tab

## Phase 2: page shell

- add Development tab entry
- add page / tab component wired into player profile

## Phase 3: section components

- build Current Snapshot panel
- build Active Plan panel
- build Routines panel
- build History panel

## Phase 4: polish

- add empty states
- add action buttons
- apply discipline-aware visual treatment
- verify layout consistency with existing tabs

---

# Notes for Codex

- Do not introduce forms or mutation flows in this task
- Do not over-normalize around `documentData`
- Do not build progression state UI
- Do not change lesson creation logic yet
- Prefer simple, readable components over abstracted complexity
- Leave TODOs where universal routines or future routes are not fully supported yet

This task should produce a useful, coach-friendly Development tab that makes the next form-building phase much easier.
