# Athlete Performance – Shared UI Components

This directory contains **shared, discipline-agnostic UI components** used by
all sections of the Athlete Performance tab (Strength, Hitting, Pitching,
Fielding, Recovery).

These components define the **interaction model, layout primitives, and control
surfaces** for performance analytics. They do NOT contain sport-specific logic,
metrics, or calculations.

---

## Core Mental Model

The Athlete Performance tab follows this hierarchy:

1. **Discipline** answers _what domain_ we are looking at
2. **Time range & filters** answer _when and under what constraints_
3. **Discipline UI** answers _what the data means_

Everything in this directory exists to support steps **1 and 2**.

---

## Responsibilities of Shared Components

Shared components must:

- Be reusable across all disciplines
- Be visually consistent
- Be data-agnostic
- Avoid vendor-specific assumptions
- Avoid calculations or analytics logic

Shared components must NOT:

- Know about Hawkin, HitTrax, ArmCare, etc.
- Know what metrics mean
- Perform comparisons or aggregations
- Fetch discipline-specific data

---

## High-Level Structure

```
shared/
├─ PerformanceHeader.tsx
├─ DisciplineSelector.tsx
├─ TimeRangeSelector.tsx
├─ PerformanceFilters.tsx
├─ CoverageIndicator.tsx
├─ CompareToggle.tsx (future)
├─ PerformanceSectionShell.tsx
├─ PerformanceEmptyState.tsx
└─ skeletons/
├─ HeaderControlsSkeleton.tsx
└─ ChartAreaSkeleton.tsx
```

---

## Component Breakdown

### 1. `PerformanceHeader.tsx`

**Type:** Server Component

**Purpose** Provides a consistent top-level header for the Performance tab.

**Contains**

- DisciplineSelector
- TimeRangeSelector
- CoverageIndicator
- Optional filter controls

**Rules**

- Pure layout + composition
- No interaction logic
- No fetching
- No discipline-specific conditionals

---

### 2. `DisciplineSelector.tsx`

**Type:** Client Component

**Purpose** Allows switching between performance disciplines:

- Hitting
- Pitching
- Fielding
- Strength
- Recovery

**Behavior**

- Updates route or query state
- Highlights active discipline
- Must feel instantaneous

**Rules**

- No data fetching
- No analytics logic
- Navigation only

---

### 3. `TimeRangeSelector.tsx`

**Type:** Client Component

**Purpose** Controls the temporal window for all performance analytics.

**Supported Ranges**

- 7 days
- 30 days
- 90 days
- Season
- Custom (future)

**Rules**

- Emits selected range only
- Does NOT apply filters itself
- Discipline components consume the selected range

---

### 4. `PerformanceFilters.tsx`

**Type:** Client Component

**Purpose** Optional constraint filters applied to performance data.

**Examples**

- Session type
- Coach
- Test type
- Competition vs training

**Rules**

- Filters are optional
- Filters are discipline-aware but not discipline-owned
- Avoid overloading MVP with filters

---

### 5. `CoverageIndicator.tsx`

**Type:** Server Component

**Purpose** Communicates **data trust and completeness**.

**Displays**

- Connected systems
- Last successful sync per system
- Sample size (e.g. “12 tests in 30 days”)
- Missing data warnings (neutral tone)

**Rules**

- Informational only
- No error handling logic
- No user actions (resync lives elsewhere)

---

### 6. `CompareToggle.tsx` (Future)

**Type:** Client Component

**Purpose** Enables comparisons such as:

- Current vs previous period
- Baseline vs current
- Pre- vs post-intervention

**Status**

- Placeholder only in MVP
- Should be easy to add later without refactor

---

### 7. `PerformanceSectionShell.tsx`

**Type:** Server Component

**Purpose** Provides consistent spacing, titles, and layout for performance
sections.

**Used For**

- KPI strips
- Chart panels
- Risk sections
- Tables

**Rules**

- No charts inside this component
- No analytics logic
- Structural only

---

### 8. `PerformanceEmptyState.tsx`

**Type:** Server Component

**Purpose** Graceful handling when no data is available.

**Examples**

- No tests in selected range
- Discipline not yet instrumented
- Athlete newly added

**Tone**

- Calm
- Informational
- Action-oriented (e.g. “Run first test”)

---

## Skeleton Components

### `HeaderControlsSkeleton.tsx`

Used when performance header data is loading.

### `ChartAreaSkeleton.tsx`

Used for:

- Trend panels
- KPI strips
- Session tables

**Rules**

- Skeletons represent layout, not content
- Avoid full-page skeletons

---

## Design & UX Principles (Mandatory)

### Server vs Client

- Navigation & selection → Client
- Layout & display → Server
- Data always flows **down**, never sideways

### Light / Dark Mode

- Use semantic tokens only
- Avoid hardcoded colors
- Charts must be legible in both themes

### Responsiveness

- Desktop-first
- Header controls wrap cleanly on tablet
- Controls collapse into vertical stacks on mobile
- No horizontal scrolling for charts

### Performance

- Avoid re-rendering discipline content on selector changes
- Use route-based navigation where possible
- Prefer server streaming over client state

---

## What Shared Components Must NOT Do

- Perform calculations
- Transform metrics
- Apply percentiles
- Interpret data meaning
- Render sport-specific labels
- Fetch discipline data

If a component starts to “understand” metrics, it belongs in a discipline
folder.

---

## Success Criteria

This shared layer is successful if:

- New disciplines can be added with no changes here
- Discipline tabs feel consistent but not constrained
- Controls feel fast and predictable
- Coaches never wonder “what am I filtering by?”

---

## Next Logical Step

Once these shared components exist, each discipline should:

1. Import them
2. Consume selected state
3. Render analytics independently

No shared component should ever need to be modified to support a new metric.
