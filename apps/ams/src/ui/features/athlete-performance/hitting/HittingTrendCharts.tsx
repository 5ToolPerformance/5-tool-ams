// ui/features/athlete-performance/hitting/HittingTrendCharts.tsx
import type { HittingTrend } from "./types";

interface HittingTrendChartsProps {
  trends: HittingTrend[];
}

function HittingTrendChartCard({ trend }: { trend: HittingTrend }) {
  return (
    <div className="space-y-2 rounded-lg border border-divider p-4">
      <div>
        <p className="text-sm font-semibold">{trend.label}</p>
        {trend.description && (
          <p className="text-xs text-muted-foreground">{trend.description}</p>
        )}
      </div>
      <div className="flex h-44 items-center justify-center rounded-md border border-dashed border-divider text-xs text-muted-foreground">
        Chart placeholder
      </div>
    </div>
  );
}

export function HittingTrendCharts({ trends }: HittingTrendChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {trends.map((trend) => (
        <HittingTrendChartCard key={trend.key} trend={trend} />
      ))}
    </div>
  );
}
