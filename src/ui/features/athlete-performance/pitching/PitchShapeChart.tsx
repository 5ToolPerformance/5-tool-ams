// ui/features/athlete-performance/pitching/PitchShapeChart.tsx
interface PitchShapeChartProps {
  title?: string;
  description?: string;
}

export function PitchShapeChart({
  title = "Pitch Shape",
  description = "TrackMan session-only movement plot.",
}: PitchShapeChartProps) {
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
