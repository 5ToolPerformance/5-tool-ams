// ui/features/athlete-performance/pitching/PitchingOverviewSection.tsx
import { PerformanceSectionShell } from "@/ui/features/athlete-performance/shared/PerformanceSectionShell";

import { PitchingKpiStrip } from "./PitchingKpiStrip";
import { PitchingTrendCharts } from "./PitchingTrendCharts";
import type { PitchingKpi, PitchingTrend } from "./types";

interface PitchingOverviewSectionProps {
  kpis: PitchingKpi[];
  trends: PitchingTrend[];
}

export function PitchingOverviewSection({
  kpis,
  trends,
}: PitchingOverviewSectionProps) {
  return (
    <PerformanceSectionShell
      title="Pitching Overview"
      description="Longitudinal velocity and usage trends."
    >
      <PitchingKpiStrip kpis={kpis} />
      <PitchingTrendCharts trends={trends} />
    </PerformanceSectionShell>
  );
}
