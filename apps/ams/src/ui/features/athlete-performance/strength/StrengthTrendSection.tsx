// ui/features/athlete-performance/strength/StrengthTrendSection.tsx
import type { NormalizedMetric } from "./types";

import { PerformanceSectionShell } from "@/ui/features/athlete-performance/shared/PerformanceSectionShell";

import { NormalizedMetricTrendChart } from "./NormalizedMetricTrendChart";
import { PowerRatingTrendChart } from "./PowerRatingTrendChart";

interface StrengthTrendSectionProps {
  primaryMetric: NormalizedMetric;
  secondaryMetrics: NormalizedMetric[];
}

export function StrengthTrendSection({
  primaryMetric,
  secondaryMetrics,
}: StrengthTrendSectionProps) {
  return (
    <PerformanceSectionShell
      title="Strength Trends"
      description="Normalized trends with rolling averages enabled."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PowerRatingTrendChart />
        <NormalizedMetricTrendChart metric={primaryMetric} />
      </div>
      {secondaryMetrics.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {secondaryMetrics.map((metric) => (
            <NormalizedMetricTrendChart key={metric.key} metric={metric} />
          ))}
        </div>
      )}
    </PerformanceSectionShell>
  );
}
