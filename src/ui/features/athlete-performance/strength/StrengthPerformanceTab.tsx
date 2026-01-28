// ui/features/athlete-performance/strength/StrengthPerformanceTab.tsx
import { Suspense } from "react";

import { ChartAreaSkeleton } from "@/ui/features/athlete-performance/shared/skeletons/ChartAreaSkeleton";
import { StrengthKpiStrip } from "./StrengthKpiStrip";
import { StrengthRiskSection } from "./StrengthRiskSection";
import { StrengthSessionTable } from "./StrengthSessionTable";
import { StrengthTrendSection } from "./StrengthTrendSection";
import type { NormalizedMetric, PowerRating, StrengthSession } from "./types";

export async function StrengthPerformanceTab() {
  const powerRating: PowerRating = {
    score: 82,
    percentile: 78,
    delta: 3,
    isRollingAverage: true,
    components: [
      { key: "CMJ / BW", weight: 40, contribution: 32 },
      { key: "RSI", weight: 35, contribution: 28 },
      { key: "Peak Power / BW", weight: 25, contribution: 22 },
    ],
  };

  const metrics: NormalizedMetric[] = [
    {
      key: "cmj_bw",
      label: "CMJ / BW",
      value: 1.42,
      unit: "x",
      percentile: 74,
      delta: 0.05,
      sampleSize: 12,
    },
    {
      key: "rsi",
      label: "RSI",
      value: 1.96,
      unit: "",
      percentile: 69,
      delta: 0.08,
      sampleSize: 11,
    },
    {
      key: "peak_power_bw",
      label: "Peak Power / BW",
      value: 52.3,
      unit: "w/kg",
      percentile: 72,
      delta: -0.4,
      sampleSize: 10,
    },
  ];

  const riskMetric: NormalizedMetric = {
    key: "asymmetry",
    label: "Asymmetry",
    value: 6.2,
    unit: "%",
    percentile: 58,
    delta: 0.6,
    sampleSize: 9,
  };

  const sessions: StrengthSession[] = [
    {
      date: "2026-01-10",
      testType: "Force Plate",
      metrics: [metrics[0], metrics[1], metrics[2]],
      powerRating,
      notesRef: "Lesson 18",
    },
    {
      date: "2026-01-04",
      testType: "Jump Scan",
      metrics: [metrics[0], metrics[1], riskMetric],
      powerRating,
      notesRef: "Baseline retest",
    },
    {
      date: "2025-12-21",
      testType: "Force Plate",
      metrics: [metrics[2], riskMetric],
      powerRating,
    },
  ];

  return (
    <div className="space-y-6">
      <StrengthKpiStrip powerRating={powerRating} metrics={metrics} />

      <Suspense fallback={<ChartAreaSkeleton />}>
        <StrengthTrendSection
          primaryMetric={metrics[0]}
          secondaryMetrics={[metrics[1]]}
        />
      </Suspense>

      <Suspense fallback={<ChartAreaSkeleton />}>
        <StrengthRiskSection />
      </Suspense>

      <Suspense fallback={<ChartAreaSkeleton />}>
        <StrengthSessionTable sessions={sessions} />
      </Suspense>
    </div>
  );
}
