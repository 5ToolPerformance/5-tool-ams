# Health Tab

This directory contains all UI components for the **Health** section of the
Player Profile.

This section serves as the **health context layer** for the athlete. It provides
coaches with immediate readiness information (ArmCare) and a clear,
chronological injury log.

The goal is to present **operational health awareness** in a calm, clinical,
coach-friendly way — not as a medical record system.

---

## Core Mental Model

Health answers four questions:

1. What is this athlete’s current arm readiness?
2. Is the athlete currently limited?
3. What injuries are active right now?
4. What health history explains performance context?

This tab is:

- Operational
- Time-aware
- Context-providing

This tab is NOT:

- A medical record vault
- A rehab management system
- A performance analytics dashboard

---

## High-Level Layout Structure

```
HealthTab
├─ ArmCareSection
│  └─ ArmCareProfileCard
│
├─ HealthStatusStrip
│  ├─ ActiveInjuryBadge
│  └─ LimitedStatusIndicator
│
├─ InjuryLogSection
│  ├─ InjuryQuickActions
│  │  └─ AddPlayerInjuryModal (external)
│  │
│  ├─ ActiveInjuryList
│  │  └─ InjuryCard
│  │     ├─ InjuryHeader
│  │     ├─ InjuryMeta
│  │     ├─ InjuryNotes
│  │     └─ ResolveButton
│  │
│  └─ ResolvedInjuryList
│     └─ InjuryCard (collapsed variant)
```

---

## Component Breakdown

### 1. `HealthTab.tsx`

**Type:** Server Component
**Role:** Orchestrator for the Health tab

**Responsibilities**

- Receive injury + ArmCare data from `page.tsx`
- Partition injuries into:

  - Active (`active`, `limited`)
  - Resolved

- Compose child sections in correct order
- Establish Suspense boundaries if needed

**Must NOT**

- Contain mutation logic
- Perform calculations
- Fetch independently (data is passed in)

---

### 2. `ArmCareSection.tsx`

**Type:** Server Component

**Purpose** Displays the athlete’s current ArmCare score and readiness status.

Uses:

- `ArmCareProfileCard`

**Displays**

- ArmCare score (0–100)
- Severity state (handled internally by `CircularScore`)
- Last exam date
- Link to full ArmCare summary page

**Rules**

- Must appear at the top of the tab
- No alarmist visual design
- No business logic inside component
- Accept placeholder data for Phase 2

**Future (Not In Scope Yet)**

- Rolling fatigue indicators
- Throw count integration
- Trend visualization

---

### 3. `HealthStatusStrip.tsx`

**Type:** Server Component

**Purpose** Provides immediate injury awareness without dominating the layout.

**Displays**

- Active injury count
- Limited indicator (if any injury.status === `"limited"`)

**Rules**

- Visually secondary to ArmCare
- Calm and clinical tone
- No charting

---

### 4. `InjuryLogSection.tsx`

**Type:** Server Component

**Purpose** Primary injury management area.

**Contains**

- Quick action trigger (Add Injury)
- Active injury list
- Resolved injury list (collapsed)

**Rules**

- No analytics here
- No editing past injuries in Phase 2
- Mutations handled via client subcomponents only

---

### 5. `InjuryCard.tsx`

**Type:** Server Component

**Purpose** Reusable display unit for an injury entry.

**Displays**

- Body Part
- Focus Area (if present)
- Side
- Severity level (Soreness / Injury / Diagnosed)
- Start Date
- End Date (if resolved)
- Notes (expandable)

If **Active**:

- Shows `ResolveButton`

If **Resolved**:

- Collapsed by default
- No mutation controls

---

### 6. `ResolveButton.tsx`

**Type:** Client Component (`"use client"`)

**Purpose** Allows coaches to mark an injury as resolved.

**Behavior**

- Inline button
- No modal
- Sets:

  - `status = resolved`
  - `endDate = now`

- Triggers:

  - `refresh()`
  - route refetch

**Must NOT**

- Contain business logic
- Directly manipulate domain models

---

### 7. `ResolvedInjuryList.tsx`

**Type:** Server Component

**Purpose** Displays historical injuries.

**Rules**

- Collapsed by default
- Sorted by most recent `endDate`
- Read-only
- No inline editing

---

## Data Shape Expectations

### Injury

```ts
{
  id: string
  bodyPart: string
  focusArea?: string
  side: "left" | "right" | "bilateral" | "none"
  level: "soreness" | "injury" | "diagnosis"
  status: "active" | "limited" | "resolved"
  startDate: string
  endDate?: string
  notes?: string
}
```

### ArmCare

```ts
{
  score: number;
  date: string;
}
```

---

## Design & Implementation Rules (Critical)

### Server-First

- Default to **Server Components**
- No `"use client"` unless mutation or interaction is required
- Calculations do NOT live in UI components

### Suspense & Skeletons

- Suspense at section-level only
- ArmCare blocks render
- Injury lists may use skeletons if necessary

### UI / Styling

- Use **HeroUI** components
- Support light and dark mode
- Avoid hardcoded colors
- Severity states must be subtle and non-alarmist

### Responsiveness

- ArmCare card full width
- Injury cards stack vertically
- Resolve button full width on mobile
- Resolved section collapsible

### Tone & UX

- Clinical, calm, coach-focused
- No gamification visuals
- Severity ≠ panic
- Injury visibility should inform, not intimidate

---

## What This Directory Should NOT Contain

- ArmCare calculation logic
- Injury business rules
- API routes
- Cross-discipline UI
- Vendor dashboards
- Performance analytics

---

## Success Criteria

This tab is successful if:

- A coach can assess arm readiness in 2 seconds
- Active injuries are immediately visible
- Injury history is easy to scan chronologically
- Resolving an injury takes one click
- The structure supports future:

  - Timeline annotations
  - Performance overlays
  - ArmCare integration upgrades

---

## Next Phase (Not in Scope Yet)

- Injury-performance overlays
- ArmCare trend charts
- Return-to-play tracking
- Throwing-arm tagging
- AI-generated health insights

These should be possible **without changing the structure defined above**.
