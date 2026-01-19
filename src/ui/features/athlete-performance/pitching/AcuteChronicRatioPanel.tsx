// ui/features/athlete-performance/pitching/AcuteChronicRatioPanel.tsx
interface AcuteChronicRatioPanelProps {
  acuteLabel?: string;
  chronicLabel?: string;
}

export function AcuteChronicRatioPanel({
  acuteLabel = "Acute workload",
  chronicLabel = "Chronic workload",
}: AcuteChronicRatioPanelProps) {
  return (
    <div className="space-y-3 rounded-lg border border-divider p-4">
      <div>
        <p className="text-sm font-semibold">Acute / Chronic Balance</p>
        <p className="text-xs text-muted-foreground">
          Neutral thresholds to keep workload in range.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md border border-dashed border-divider p-3">
          <p className="text-xs text-muted-foreground">{acuteLabel}</p>
          <p className="text-lg font-semibold">7.4</p>
        </div>
        <div className="rounded-md border border-dashed border-divider p-3">
          <p className="text-xs text-muted-foreground">{chronicLabel}</p>
          <p className="text-lg font-semibold">6.1</p>
        </div>
      </div>
      <div className="rounded-md border border-dashed border-divider p-3 text-xs text-muted-foreground">
        Ratio sits in a neutral band. No alert language until clinically
        justified.
      </div>
    </div>
  );
}
