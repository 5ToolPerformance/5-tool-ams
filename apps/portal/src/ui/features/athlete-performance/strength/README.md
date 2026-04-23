# Strength & Conditioning Performance Tab

This directory contains all UI components for the **Strength & Conditioning
discipline** within the Athlete Performance tab.

This section is the **most analytics-heavy** part of the athlete page and serves
as the _evidence layer_ for physical development, power, and readiness.

The goal is to present **normalized metrics, percentiles, and trend data** in a
coach-friendly, explainable way — not as a raw vendor dashboard.

---

## Core Mental Model

Strength & Conditioning answers four questions:

1. How powerful is this athlete right now?
2. Is power improving, stagnating, or declining?
3. Is asymmetry or fatigue emerging?
4. How does this athlete compare to peers?

Everything in this directory must map back to one of those questions.

---

## High-Level Layout Structure

```
StrengthPerformanceTab
├─ StrengthHeaderControls
│  ├─ DisciplineSwitcher (shared, external)
│  ├─ TimeRangeSelector
│  ├─ CompareToggle (future)
│  └─ CoverageIndicator
│
├─ StrengthKpiStrip
│  ├─ PowerRatingCard
│  ├─ NormalizedMetricCard (CMJ/BW)
│  ├─ NormalizedMetricCard (RSI)
│  ├─ NormalizedMetricCard (Asymmetry)
│
├─ StrengthTrendSection
│  ├─ PowerRatingTrendChart
│  ├─ NormalizedMetricTrendChart (CMJ/BW)
│  ├─ NormalizedMetricTrendChart (RSI)
│
├─ StrengthRiskSection
│  └─ AsymmetryTrendChart
│
├─ StrengthSessionTable
│
└─ PowerRatingBreakdown (optional / expandable)
```

## Component Breakdown

### 1. `StrengthPerformanceTab.tsx`

**Type:** Server Component (async)\
**Role:** Orchestrator for the Strength discipline

**Responsibilities**

- Fetch strength-related performance data (fake data initially)
- Define section ordering
- Establish Suspense boundaries
- Compose child components

**Must NOT**

- Contain visualization logic
- Contain calculation logic
- Handle client-side state

---

### 2. `StrengthHeaderControls.tsx`

**Type:** Server Component

**Responsibilities**

- Display time range selection state (passed in)
- Display data coverage (last sync, test count)
- Provide layout slot for shared discipline switcher (external)

**Notes**

- Time range selector may become client-side later
- For now, assume props are already resolved

---

### 3. `StrengthKpiStrip.tsx`

**Type:** Server Component

**Purpose** Displays the most important normalized metrics and percentiles at a
glance.

**Contains**

- `PowerRatingCard`
- Multiple `NormalizedMetricCard`s

**Rules**

- 4–6 KPIs max
- Always show percentile + delta
- No charts here (sparklines optional later)

---

### 4. `PowerRatingCard.tsx`

**Type:** Server Component

**Purpose** Displays the proprietary **Power Rating**, which is:

- A 0–100 score
- Percentile-ranked
- Derived from normalized Hawkin metrics

**Displays**

- Score
- Percentile
- Trend delta (e.g. 30-day)
- Optional indicator if rolling average is used

**Must NOT**

- Perform calculations
- Hide explainability

---

### 5. `NormalizedMetricCard.tsx`

**Type:** Server Component

**Used For**

- CMJ / bodyweight
- RSI
- Peak power / bodyweight
- Asymmetry %

**Displays**

- Metric value
- Percentile
- Directional delta
- Sample size (optional)

---

### 6. `StrengthTrendSection.tsx`

**Type:** Server Component

**Purpose** Primary visual analytics area.

**Contains**

- One dominant trend chart (Power Rating)
- 1–2 secondary normalized metric trend charts

**Rules**

- Trend charts are **time-based**
- Only normalized metrics appear here
- Rolling averages are enabled by default
- Raw values + smoothed values are both visible

---

### 7. `PowerRatingTrendChart.tsx`

**Type:** Server Component

**Purpose** Shows how the Power Rating changes over time.

**Features**

- Raw points
- Rolling average
- Tooltip with score + percentile
- Support for annotations (lessons / injuries)

---

### 8. `NormalizedMetricTrendChart.tsx`

**Type:** Server Component

**Used For**

- CMJ/BW trend
- RSI trend
- Other normalized Hawkin metrics

**Rules**

- Must support toggling between raw value and percentile view
- Must support rolling average overlay
- Must support annotations (future)

---

### 9. `StrengthRiskSection.tsx`

**Type:** Server Component

**Purpose** Highlights risk-related metrics (primarily asymmetry).

**Contains**

- `AsymmetryTrendChart`

**Rules**

- Clear thresholds (e.g. <5%, 5–10%, >10%)
- Neutral, clinical tone
- No alarmist UI

---

### 10. `StrengthSessionTable.tsx`

**Type:** Server Component

**Purpose** Provides session-level transparency.

**Columns**

- Date
- Test type
- Power Rating (session)
- Key normalized metrics
- Notes / lesson link

**Rules**

- Read-only
- Sortable later
- No inline editing

---

### 11. `PowerRatingBreakdown.tsx`

**Type:** Server Component (optional, expandable)

**Purpose** Explainability for the proprietary Power Rating.

**Displays**

- Component contributions
- Weighting
- Primary driver of recent change

**This component may initially render `null`.**

---

## Data Shape Expectations (Fake Data OK)

All components should assume data shaped like:

### Normalized Metric

```ts
{
  key: string
  value: number
  unit: string
  percentile: number
  delta?: number
  sampleSize?: number
}
```

### Power Rating

```ts
{
  score: number
  percentile: number
  delta?: number
  components: {
    key: string
    weight: number
    contribution: number
  }[]
}
```

### Strength Session

```ts
{
  date: string
  testType: string
  metrics: NormalizedMetric[]
  powerRating: PowerRating
  notesRef?: string
}
```

---

## Design & Implementation Rules (Critical)

### Server-First

- Default to **Server Components**
- No `"use client"` unless interaction is required
- Calculations do NOT live in UI components

### Suspense & Skeletons

- Suspense at **section-level**, not page-level
- Skeletons for charts and tables only
- Header + KPIs should block render

### UI / Styling

- Use **HeroUI** components where possible
- Support **light and dark mode** via design tokens
- Avoid hardcoded colors; rely on semantic tokens
- Charts must be readable in both themes

### Responsiveness

- Desktop-first
- KPI strip collapses into stacked cards on mobile
- Charts stack vertically on small screens
- Tables may collapse into cards on mobile later

### Tone & UX

- Analytical, calm, coach-focused
- No gamification visuals
- Percentiles ≠ rankings (be careful with copy)
- Explainability is mandatory for derived metrics

---

## What This Directory Should NOT Contain

- Vendor-specific naming (e.g. "HawkinChart")
- Business logic or calculations
- Cross-discipline UI
- Navigation or routing logic
- Global layout components

---

## Success Criteria

This tab is successful if:

- A coach can explain _why_ a metric changed
- Percentiles provide context without intimidation
- Power Rating feels trustworthy, not magical
- New strength metrics can be added without redesigning the UI

---

## Next Phase (Not in Scope Yet)

- Cross-discipline correlations (power vs hitting EV)
- Predictive risk modeling
- AI-generated insights
- Multi-cohort percentile comparisons

These should be possible **without changing the structure defined above**.
