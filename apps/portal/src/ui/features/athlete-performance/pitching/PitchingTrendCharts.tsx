// ui/features/athlete-performance/pitching/PitchingTrendCharts.tsx
import type { PitchingTrend } from "./types";

interface PitchingTrendChartsProps {
  trends: PitchingTrend[];
}

function PitchingTrendChartCard({ trend }: { trend: PitchingTrend }) {
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

export function PitchingTrendCharts({ trends }: PitchingTrendChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {trends.map((trend) => (
        <PitchingTrendChartCard key={trend.key} trend={trend} />
      ))}
    </div>
  );
}
