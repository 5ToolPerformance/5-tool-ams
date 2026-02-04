// ui/features/athlete-performance/hitting/HittingPerformanceTab.tsx
import { Suspense } from "react";

import { PerformanceDocumentsPanel } from "@/ui/features/athlete-performance/shared/PerformanceDocumentsPanel";
import { ChartAreaSkeleton } from "@/ui/features/athlete-performance/shared/skeletons/ChartAreaSkeleton";
import { HittingOverviewSection } from "./HittingOverviewSection";
import { HittingSessionsSection } from "./HittingSessionsSection";
import type { HittingKpi, HittingSession, HittingTrend } from "./types";
import type { PerformanceDocumentsAttachment } from "@/application/players/performance-documents/getPerformanceDocumentsData";

type HittingPerformanceTabProps = {
  performanceAttachments: PerformanceDocumentsAttachment[];
};

const HITTING_SOURCES = ["hitting", "hittrax", "blast_motion", "video"];

export async function HittingPerformanceTab({
  performanceAttachments,
}: HittingPerformanceTabProps) {
  const kpis: HittingKpi[] = [
    {
      key: "avg_ev",
      label: "Avg Exit Velocity",
      value: 84.6,
      unit: "mph",
      source: "derived",
      helper: "Derived from lesson notes",
    },
    {
      key: "max_ev",
      label: "Max Exit Velocity",
      value: 96.2,
      unit: "mph",
      source: "placeholder",
      helper: "Awaiting HitTrax integration",
    },
    {
      key: "contact_consistency",
      label: "Contact Consistency",
      value: "Steady",
      source: "derived",
      helper: "Lesson-based proxy",
    },
    {
      key: "primary_focus",
      label: "Primary Mechanical Focus",
      value: "Connection + timing",
      source: "derived",
    },
  ];

  const trends: HittingTrend[] = [
    {
      key: "avg_ev_trend",
      label: "Avg Exit Velocity Trend",
      description: "Lesson-tagged rolling average over time.",
    },
    {
      key: "max_ev_trend",
      label: "Max Exit Velocity Trend",
      description: "Upper bound performance with session markers.",
    },
    {
      key: "bat_speed_trend",
      label: "Bat Speed Trend",
      description: "Blast-ready trend for swing speed.",
    },
    {
      key: "lesson_density",
      label: "Lesson Density",
      description: "Weekly cadence overlay to explain changes.",
    },
  ];

  const sessions: HittingSession[] = [
    {
      id: "session-102",
      date: "2026-01-12",
      system: "hittrax",
      swings: 42,
      metrics: {
        avgEV: 86.1,
        maxEV: 99.4,
        avgLA: 14.2,
      },
      sprayChart: [
        { x: 32, y: 54, result: "line drive" },
        { x: 12, y: 64, result: "fly ball" },
        { x: -18, y: 42, result: "ground ball" },
      ],
      lessonRef: "Lesson 21",
    },
    {
      id: "session-101",
      date: "2026-01-05",
      system: "blast",
      swings: 55,
      metrics: {
        batSpeed: 71.8,
        attackAngle: 11.6,
      },
      lessonRef: "Lesson 20",
    },
    {
      id: "session-100",
      date: "2025-12-22",
      system: "lesson",
      lessonRef: "Lesson 19",
    },
  ];

  const selectedSession = sessions[0] ?? null;

  return (
    <div className="space-y-6">
      <Suspense fallback={<ChartAreaSkeleton />}>
        <HittingOverviewSection kpis={kpis} trends={trends} />
      </Suspense>

      <Suspense fallback={<ChartAreaSkeleton />}>
        <HittingSessionsSection
          sessions={sessions}
          selectedSession={selectedSession}
        />
      </Suspense>

      <PerformanceDocumentsPanel
        title="Hitting Documents"
        attachments={performanceAttachments}
        allowedSources={HITTING_SOURCES}
      />
    </div>
  );
}
