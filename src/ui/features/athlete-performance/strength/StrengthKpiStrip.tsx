// ui/features/athlete-performance/strength/StrengthKpiStrip.tsx
import type { NormalizedMetric, PowerRating } from "./types";

import { NormalizedMetricCard } from "./NormalizedMetricCard";
import { PowerRatingCard } from "./PowerRatingCard";

interface StrengthKpiStripProps {
  powerRating: PowerRating;
  metrics: NormalizedMetric[];
}

export function StrengthKpiStrip({
  powerRating,
  metrics,
}: StrengthKpiStripProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <PowerRatingCard rating={powerRating} />
      {metrics.map((metric) => (
        <NormalizedMetricCard key={metric.key} metric={metric} />
      ))}
    </div>
  );
}
