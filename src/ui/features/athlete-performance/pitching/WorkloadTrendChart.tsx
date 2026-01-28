// ui/features/athlete-performance/pitching/WorkloadTrendChart.tsx
interface WorkloadTrendChartProps {
  title?: string;
  description?: string;
}

export function WorkloadTrendChart({
  title = "Workload Trend",
  description = "Throws per week with intensity weighting.",
}: WorkloadTrendChartProps) {
  return (
    <div className="space-y-2 rounded-lg border border-divider p-4">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex h-48 items-center justify-center rounded-md border border-dashed border-divider text-xs text-muted-foreground">
        Chart placeholder
      </div>
    </div>
  );
}
