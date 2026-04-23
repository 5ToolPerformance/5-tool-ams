// ui/features/athlete-performance/strength/AsymmetryTrendChart.tsx
interface AsymmetryTrendChartProps {
  title?: string;
  description?: string;
}

export function AsymmetryTrendChart({
  title = "Asymmetry Trend",
  description = "Track left/right balance over time.",
}: AsymmetryTrendChartProps) {
  return (
    <div className="space-y-2 rounded-lg border border-divider p-4">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-divider text-xs text-muted-foreground">
        Chart placeholder
      </div>
    </div>
  );
}
