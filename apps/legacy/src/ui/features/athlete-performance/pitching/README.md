# Pitching Performance Discipline

This directory contains UI components for the **Pitching discipline** within the Athlete Performance tab.

The Pitching Performance view integrates **workload, velocity, command, and pitch-shape data** from ArmCare and TrackMan, while maintaining **lessons and health context** as first-class explanatory signals.

The goal is to allow coaches to:

- Monitor pitching development over time
- Assess workload and risk responsibly
- Analyze individual bullpen / game sessions in detail
- Make informed decisions without leaving the AMS

---

## Core Mental Model

Pitching performance answers four questions:

1. Is the pitcher **throwing harder or more efficiently over time**?
2. Is workload being managed **safely and intentionally**?
3. Are pitch characteristics (shape, consistency) improving?
4. How do lessons, cues, and health events explain changes?

Pitching performance is therefore structured around **Trends + Sessions**, with **workload and health signals always in view**.

---

## High-Level Page Structure

```

PitchingPerformanceTab
├─ PitchingHeaderControls
│  ├─ DisciplineSelector (shared, external)
│  ├─ TimeRangeSelector
│  ├─ CoverageIndicator (ArmCare / TrackMan)
│
├─ PitchingOverviewSection            ← longitudinal layer
│  ├─ PitchingKpiStrip
│  ├─ PitchingTrendCharts
│
├─ PitchingWorkloadSection            ← safety layer
│  ├─ WorkloadTrendChart
│  ├─ Acute / Chronic Ratio Panel
│
├─ PitchingSessionsSection            ← session layer
│  ├─ PitchingSessionList / Table
│  └─ PitchingSessionViewer (drawer / modal)
│
└─ IntegrationNotes / EmptyStates

```

---

## Section Responsibilities

### 1. Longitudinal Performance Layer

**Purpose**
Answers:

> “Is this pitcher improving in a sustainable way?”

This layer focuses on **velocity trends, efficiency, and pitch characteristics**, aggregated across sessions.

---

### 2. Workload & Risk Layer

**Purpose**
Answers:

> “Is this athlete being stressed appropriately?”

This layer is **non-negotiable** and must always be visible when ArmCare data exists.

---

### 3. Session Layer

**Purpose**
Answers:

> “What happened in this bullpen or outing?”

This replaces the need to open TrackMan or ArmCare dashboards externally.

---

## Component Breakdown

### 1. `PitchingPerformanceTab.tsx`

**Type:** Server Component (async)

**Role**

- Orchestrates the Pitching discipline
- Fetches pitching-related performance data (fake initially)
- Composes longitudinal, workload, and session sections
- Defines Suspense boundaries

**Must NOT**

- Perform calculations
- Hardcode vendor assumptions
- Mix workload logic into unrelated components

---

## Header & Controls

### 2. `PitchingHeaderControls.tsx`

**Type:** Server Component

**Purpose**
Shared discipline header area.

**Displays**

- Time range
- Coverage indicators:
  - ArmCare: connected / last sync
  - TrackMan: connected / last sync

**Tone**

- Clinical
- Informational
- Non-alarmist

---

## Longitudinal Performance (Trends)

### 3. `PitchingOverviewSection.tsx`

**Type:** Server Component

**Purpose**
Container for growth-over-time analytics.

---

### 4. `PitchingKpiStrip.tsx`

**Type:** Server Component

**Purpose**
High-level pitching performance summary.

**MVP KPIs**

- Avg Velocity
- Max Velocity
- Velocity Consistency (variance proxy)
- Primary Pitch Focus (from lessons)
- Pitch Mix Stability (if TrackMan exists)

**Future KPIs**

- Whiff %
- CSW %
- Command metrics
- Stuff-style composite scores

**Rules**

- KPIs must be replaceable without layout changes
- Derived vs measured metrics must be labeled
- Percentiles may be added later, not assumed now

---

### 5. `PitchingTrendCharts.tsx`

**Type:** Server Component

**Purpose**
Shows performance trends over time.

**MVP Charts**

- Avg / Max velocity over time
- Pitch usage over time (stacked area or bars)
- Lesson annotation overlays (mechanical focus, intent)

**Rules**

- Line-based trends first
- No per-pitch scatter plots here
- Pitch shape lives at session-level

---

## Workload & Risk

### 6. `PitchingWorkloadSection.tsx`

**Type:** Server Component

**Purpose**
Displays workload and stress signals derived from ArmCare.

---

### 7. `WorkloadTrendChart.tsx`

**Type:** Server Component

**Purpose**
Shows workload accumulation over time.

**Examples**

- Throws per day / week
- Intensity-weighted throws
- Acute workload trend

---

### 8. `AcuteChronicRatioPanel.tsx`

**Type:** Server Component

**Purpose**
Communicates workload balance.

**Displays**

- Acute workload
- Chronic workload
- Ratio with safe / caution / risk bands

**Rules**

- Neutral visual language
- Clear thresholds
- No “red alert” UI unless clinically justified

---

## Session-Level Analysis

### 9. `PitchingSessionsSection.tsx`

**Type:** Server Component

**Purpose**
Container for session-level inspection.

---

### 10. `PitchingSessionList.tsx`

**Type:** Server Component

**Purpose**
Browse pitching sessions.

**Displays**

- Date
- System (ArmCare / TrackMan)
- Session type (bullpen, game, flat ground)
- Throws / pitches
- Avg / Max velocity
- Linked lesson indicator

---

### 11. `PitchingSessionViewer.tsx`

**Type:** Server Component (rendered conditionally)

**Purpose**
Deep analysis of a single pitching session.

This is the **primary replacement** for TrackMan and ArmCare dashboards.

---

#### Viewer Layout (Conceptual)

```

Session Header
├─ Date, system, session type
├─ Throws / pitches, duration
├─ Linked lesson & health status

Session Body
├─ Pitch Metrics Panel
│  ├─ Avg / Max velocity
│  ├─ Spin rate
│  ├─ Spin axis
│  ├─ Extension (if available)
│
├─ Pitch Shape Visuals
│  ├─ HB / VB plot
│  ├─ Release consistency
│
├─ Workload Breakdown
│  ├─ Throw count
│  ├─ Intensity distribution
│
└─ Linked Lesson & Notes

```

---

### 12. `PitchShapeChart.tsx`

**Type:** Server Component

**Purpose**
Visualizes pitch movement characteristics.

**Rules**

- Session-level only
- No aggregation
- Clear axis labeling
- Color-coded by pitch type

---

### 13. `PitchingSessionMetricsPanel.tsx`

**Type:** Server Component

**Purpose**
Displays per-session metrics.

**Behavior**

- Adapts to system:
  - TrackMan → velocity, spin, movement
  - ArmCare → workload, intensity

**Rules**

- Show only available metrics
- Avoid placeholder numbers
- Explicit units everywhere

---

## Data Shape Expectations (Fake Data OK)

### Pitching Session

```ts
{
  id: string
  date: string
  system: "armcare" | "trackman"
  sessionType: "bullpen" | "game" | "flat"
  throws?: number
  pitches?: number
  metrics?: {
    avgVelo?: number
    maxVelo?: number
    spinRate?: number
    horizBreak?: number
    vertBreak?: number
  }
  workload?: {
    acute?: number
    chronic?: number
  }
  lessonRef?: string
  healthRef?: string
}
```

---

## Design & UX Principles (Mandatory)

### Workload Is Always Context

- Velocity gains without workload context are misleading
- Workload panels should never be hidden

### Trends ≠ Sessions

- Trends show direction
- Sessions show detail
- Pitch shape never appears in trend charts

### Lessons & Health Are Always Linked

- Session viewer must show lesson and health context
- No metric should exist in isolation

### Server-First

- Default to server components
- Client components only if interaction demands it (drawer open/close later)

### Light / Dark Mode

- Use HeroUI components
- Semantic tokens only
- Charts must remain legible in both themes

### Responsiveness

- Desktop-first
- Session viewer may expand to full-screen on mobile
- Dense charts stack vertically on smaller screens

---

## What This Directory Must NOT Contain

- Vendor dashboard replicas
- Per-pitch tables by default
- Raw CSV-style exports
- Cross-discipline analytics
- Prediction or risk scoring logic (yet)

If it feels like TrackMan’s UI, it’s wrong.

---

## Success Criteria

This section is successful if:

- Coaches can evaluate pitching development responsibly
- Workload and velocity are always interpreted together
- Sessions can be analyzed without opening external tools
- Lessons clearly explain changes in performance
- TrackMan and ArmCare data feel unified, not stitched together

---

## Future (Out of Scope)

- Stuff-style composite metrics
- Command modeling
- Injury risk prediction
- AI-generated workload insights
- Cross-discipline correlations

These must fit into the structure above **without redesign**.
