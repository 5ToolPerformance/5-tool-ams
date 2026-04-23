// ui/features/athlete-performance/strength/NormalizedMetricTrendChart.tsx
import type { NormalizedMetric } from "./types";

interface NormalizedMetricTrendChartProps {
  metric: NormalizedMetric;
  viewLabel?: string;
}

export function NormalizedMetricTrendChart({
  metric,
  viewLabel = "Value view (percentile toggle coming soon)",
}: NormalizedMetricTrendChartProps) {
  return (
    <div className="space-y-2 rounded-lg border border-divider p-4">
      <div className="space-y-1">
        <p className="text-sm font-semibold">{metric.label} Trend</p>
        <p className="text-xs text-muted-foreground">{viewLabel}</p>
      </div>
      <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-divider text-xs text-muted-foreground">
        Chart placeholder
      </div>
    </div>
  );
}
