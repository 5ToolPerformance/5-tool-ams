// ui/features/athlete-performance/hitting/HittingOverviewSection.tsx
import { PerformanceSectionShell } from "@/ui/features/athlete-performance/shared/PerformanceSectionShell";

import { HittingKpiStrip } from "./HittingKpiStrip";
import { HittingTrendCharts } from "./HittingTrendCharts";
import type { HittingKpi, HittingTrend } from "./types";

interface HittingOverviewSectionProps {
  kpis: HittingKpi[];
  trends: HittingTrend[];
}

export function HittingOverviewSection({
  kpis,
  trends,
}: HittingOverviewSectionProps) {
  return (
    <PerformanceSectionShell
      title="Hitting Overview"
      description="Longitudinal trends with lesson context highlighted."
    >
      <HittingKpiStrip kpis={kpis} />
      <HittingTrendCharts trends={trends} />
    </PerformanceSectionShell>
  );
}
