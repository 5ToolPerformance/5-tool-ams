// ui/features/athlete-performance/hitting/SprayChart.tsx
import type { HittingSprayPoint } from "./types";

interface SprayChartProps {
  points?: HittingSprayPoint[];
}

export function SprayChart({ points }: SprayChartProps) {
  const pointCount = points?.length ?? 0;
  const label =
    pointCount > 0
      ? `${pointCount} batted balls plotted`
      : "No spray chart data available.";

  return (
    <div className="space-y-2 rounded-lg border border-divider p-4">
      <div>
        <p className="text-sm font-semibold">Spray Chart</p>
        <p className="text-xs text-muted-foreground">
          HitTrax session-only visualization.
        </p>
      </div>
      <div className="flex h-48 items-center justify-center rounded-md border border-dashed border-divider text-xs text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
