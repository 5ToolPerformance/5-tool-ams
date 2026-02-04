// ui/features/athlete-performance/pitching/PitchingPerformanceTab.tsx
import { Suspense } from "react";

import { PerformanceDocumentsPanel } from "@/ui/features/athlete-performance/shared/PerformanceDocumentsPanel";
import { ChartAreaSkeleton } from "@/ui/features/athlete-performance/shared/skeletons/ChartAreaSkeleton";
import { PitchingOverviewSection } from "./PitchingOverviewSection";
import { PitchingWorkloadSection } from "./PitchingWorkloadSection";
import { PitchingSessionsSection } from "./PitchingSessionsSection";
import type { PitchingKpi, PitchingSession, PitchingTrend } from "./types";
import type { PerformanceDocumentsAttachment } from "@/application/players/performance-documents/getPerformanceDocumentsData";

type PitchingPerformanceTabProps = {
  performanceAttachments: PerformanceDocumentsAttachment[];
};

const PITCHING_SOURCES = ["pitching", "trackman", "video"];

export async function PitchingPerformanceTab({
  performanceAttachments,
}: PitchingPerformanceTabProps) {
  const kpis: PitchingKpi[] = [
    {
      key: "avg_velo",
      label: "Avg Velocity",
      value: 83.4,
      unit: "mph",
      source: "measured",
    },
    {
      key: "max_velo",
      label: "Max Velocity",
      value: 88.9,
      unit: "mph",
      source: "measured",
    },
    {
      key: "velo_consistency",
      label: "Velocity Consistency",
      value: "Stable",
      source: "derived",
      helper: "Variance proxy from recent sessions",
    },
    {
      key: "primary_focus",
      label: "Primary Pitch Focus",
      value: "Fastball command",
      source: "derived",
    },
  ];

  const trends: PitchingTrend[] = [
    {
      key: "avg_velo_trend",
      label: "Avg Velocity Trend",
      description: "Rolling averages with lesson overlays.",
    },
    {
      key: "max_velo_trend",
      label: "Max Velocity Trend",
      description: "Upper-bound effort over time.",
    },
    {
      key: "pitch_mix_trend",
      label: "Pitch Mix Trend",
      description: "Usage stability across recent sessions.",
    },
  ];

  const sessions: PitchingSession[] = [
    {
      id: "pitch-204",
      date: "2026-01-14",
      system: "trackman",
      sessionType: "bullpen",
      throws: 38,
      metrics: {
        avgVelo: 84.1,
        maxVelo: 89.7,
        spinRate: 2150,
        horizBreak: -9.2,
        vertBreak: 14.6,
      },
      lessonRef: "Lesson 22",
    },
    {
      id: "pitch-203",
      date: "2026-01-07",
      system: "armcare",
      sessionType: "flat",
      throws: 52,
      workload: {
        acute: 7.4,
        chronic: 6.1,
      },
      healthRef: "Arm status: green",
      lessonRef: "Lesson 21",
    },
    {
      id: "pitch-202",
      date: "2025-12-28",
      system: "trackman",
      sessionType: "game",
      pitches: 76,
      metrics: {
        avgVelo: 82.9,
        maxVelo: 87.2,
        spinRate: 2090,
        horizBreak: -8.3,
        vertBreak: 13.9,
      },
      lessonRef: "Lesson 20",
    },
  ];

  const selectedSession = sessions[0] ?? null;

  return (
    <div className="space-y-6">
      <Suspense fallback={<ChartAreaSkeleton />}>
        <PitchingOverviewSection kpis={kpis} trends={trends} />
      </Suspense>

      <Suspense fallback={<ChartAreaSkeleton />}>
        <PitchingWorkloadSection />
      </Suspense>

      <Suspense fallback={<ChartAreaSkeleton />}>
        <PitchingSessionsSection
          sessions={sessions}
          selectedSession={selectedSession}
        />
      </Suspense>

      <PerformanceDocumentsPanel
        title="Pitching Documents"
        attachments={performanceAttachments}
        allowedSources={PITCHING_SOURCES}
      />
    </div>
  );
}
