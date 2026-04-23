# Hitting Performance Discipline

This directory contains UI components for the **Hitting discipline** within the Athlete Performance tab.

The Hitting Performance view is designed to support **two complementary workflows**:

1. **Longitudinal performance evaluation**  
   (“Is this hitter improving over time?”)

2. **Session-level analysis**  
   (“What happened in _this_ HitTrax / Blast session?”)

The page must allow coaches to evaluate growth **and** inspect individual sessions in depth — without ever leaving the AMS to open external tools.

---

## Core Mental Model

Hitting performance is structured around **Trends + Sessions**.

- **Trends** show _direction, consistency, and response to training_
- **Sessions** show _what actually happened on a given day_

These two layers must remain **visually and conceptually distinct**, but tightly linked through lesson context.

Lessons are the **narrative glue** that explains both.

---

## High-Level Page Structure

```

HittingPerformanceTab
├─ HittingHeaderControls
│  ├─ DisciplineSelector (shared, external)
│  ├─ TimeRangeSelector
│  ├─ CoverageIndicator (HitTrax / Blast / Lesson-only)
│
├─ HittingOverviewSection            ← longitudinal layer
│  ├─ HittingKpiStrip
│  ├─ HittingTrendCharts
│
├─ HittingSessionsSection            ← session layer
│  ├─ HittingSessionList / Table
│  └─ HittingSessionViewer (drawer / modal)
│
└─ IntegrationNotes / EmptyStates

```

---

## Section Responsibilities

### 1. Longitudinal Layer (Top of Page)

**Purpose**
Answers:

> “Is the athlete’s hitting performance improving over time, and why?”

This layer aggregates data across sessions and should feel similar in rigor to the **Strength** discipline.

---

### 2. Session Layer (Bottom of Page)

**Purpose**
Answers:

> “What happened in this specific session?”

This layer replaces the need to open HitTrax or Blast Motion externally.

Sessions are:

- Browseable
- Expandable
- Deep only when opened

---

## Component Breakdown

### 1. `HittingPerformanceTab.tsx`

**Type:** Server Component (async)

**Role**

- Orchestrates the full Hitting discipline
- Fetches hitting-related performance data (fake initially)
- Composes longitudinal + session sections
- Defines Suspense boundaries

**Must NOT**

- Contain calculations
- Assume any sensor integration exists
- Mirror vendor UIs

---

## Header & Controls

### 2. `HittingHeaderControls.tsx`

**Type:** Server Component

**Purpose**
Shared discipline header area.

**Displays**

- Active time range
- Coverage indicator:
  - Lesson-derived only
  - HitTrax connected / not connected
  - Blast Motion connected / not connected

**Tone**

- Transparent
- Informational
- Non-blocking

---

## Longitudinal Performance (Trends)

### 3. `HittingOverviewSection.tsx`

**Type:** Server Component

**Purpose**
Container for growth-over-time analytics.

---

### 4. `HittingKpiStrip.tsx`

**Type:** Server Component

**Purpose**
High-level performance summary.

**Current (Pre-integration) KPIs**

- Avg Exit Velocity (derived from lessons or placeholder)
- Max Exit Velocity (placeholder)
- Contact Consistency (derived proxy)
- Primary Mechanical Focus (from lessons)

**Future KPIs (Post-integration)**

- Avg EV (HitTrax)
- Max EV
- Hard Hit %
- Sweet Spot %
- Bat Speed (Blast)
- Attack Angle (Blast)

**Rules**

- Clearly label derived vs measured metrics
- Avoid false precision before integrations exist
- KPIs must be replaceable without layout change

---

### 5. `HittingTrendCharts.tsx`

**Type:** Server Component

**Purpose**
Show performance trends over time.

**MVP Charts**

- Avg Exit Velocity over time (placeholder initially)
- Max Exit Velocity over time (placeholder)
- Bat Speed over time (Blast-ready)
- Lesson frequency / density overlay

**Rules**

- Line charts with optional rolling averages
- Support lesson annotations
- No spray charts here

---

## Session-Level Analysis

### 6. `HittingSessionsSection.tsx`

**Type:** Server Component

**Purpose**
Container for all session-level inspection.

---

### 7. `HittingSessionList.tsx`

**Type:** Server Component

**Purpose**
Browse and select sessions.

**Displays (Row-level)**

- Date
- System (HitTrax / Blast / Lesson-only)
- Swings (if available)
- Avg EV (if available)
- Max EV (if available)
- Linked lesson indicator

**Rules**

- Read-only
- Chronological
- Clicking a row opens Session Viewer

---

### 8. `HittingSessionViewer.tsx`

**Type:** Server Component (rendered conditionally)

**Purpose**
Deep inspection of a single hitting session.

This is the **primary replacement** for external HitTrax / Blast UIs.

---

#### Viewer Layout (Conceptual)

```

Session Header
├─ Date, system, coach
├─ Swings, duration
├─ Linked lesson summary

Session Body
├─ Spray Chart (HitTrax only)
├─ Session Metrics Panel
│  ├─ Avg EV
│  ├─ Max EV
│  ├─ Avg LA
│  ├─ Sweet Spot %
│  ├─ Bat Speed (Blast)
│
├─ Distributions (optional)
│  ├─ EV histogram
│  ├─ LA histogram
│
└─ Linked Lesson Notes

```

---

### 9. `SprayChart.tsx`

**Type:** Server Component

**Purpose**
Visualizes batted ball distribution for HitTrax sessions.

**Rules**

- Session-level only
- No aggregation
- No use in trend charts
- Must work in light and dark mode

---

### 10. `HittingSessionMetricsPanel.tsx`

**Type:** Server Component

**Purpose**
Displays per-session metrics.

**Behavior**

- Adapts to system type:
  - HitTrax → EV, LA, outcome
  - Blast → Bat speed, attack angle, timing

**Rules**

- Only show metrics that exist
- Do not invent placeholders
- Clear units and labels

---

## Data Shape Expectations (Fake Data OK)

### Hitting Session

```ts
{
  id: string
  date: string
  system: "hittrax" | "blast" | "lesson"
  swings?: number
  metrics?: {
    avgEV?: number
    maxEV?: number
    avgLA?: number
    batSpeed?: number
    attackAngle?: number
  }
  sprayChart?: {
    x: number
    y: number
    result?: string
  }[]
  lessonRef?: string
}
```

---

## Design & UX Principles (Mandatory)

### Trends ≠ Sessions

- Trends answer _direction_
- Sessions answer _detail_
- Never mix spray charts into trend views

### Lessons Are Always Visible

- Every session must reference lesson context when available
- Sensor data never stands alone

### Server-First

- All components default to server
- Client components only if interaction is unavoidable (drawer open/close later)

### Light / Dark Mode

- Use HeroUI components
- Use semantic tokens only
- Charts must be readable in both themes

### Responsiveness

- Desktop-first
- Session viewer may become full-screen on mobile
- Tables collapse to cards on small screens

---

## What This Directory Must NOT Contain

- Vendor UI replicas
- Raw CSV-like tables
- Cross-discipline analytics
- Percentiles (until real metrics exist)
- Calculation logic

If a component feels like “HitTrax inside our app”, it’s too far.

---

## Success Criteria

This section is successful if:

- Coaches can evaluate hitting progress without integrations
- Coaches can analyze a session without opening external tools
- Lesson intent clearly explains performance changes
- HitTrax and Blast can be added without rethinking the page

---

## Future (Out of Scope)

- Percentiles for EV and bat speed
- Correlations with strength metrics
- Predictive contact quality models
- AI-generated session summaries

These should fit into the structure above **without redesign**.
