// ui/features/athlete-performance/shared/CoverageIndicator.tsx
import { Chip } from "@heroui/react";

export type CoverageStatus =
  | "synced"
  | "stale"
  | "missing"
  | "not-linked"
  | "partial";

export type CoverageSystem = {
  name: string;
  status: CoverageStatus;
  lastSync?: string;
};

interface CoverageIndicatorProps {
  title?: string;
  sampleSizeLabel?: string;
  systems: CoverageSystem[];
  warnings?: string[];
}

const STATUS_STYLES: Record<
  CoverageStatus,
  { label: string; color?: "success" | "warning" | "default" }
> = {
  synced: { label: "Synced", color: "success" },
  stale: { label: "Out of date", color: "warning" },
  missing: { label: "Missing" },
  "not-linked": { label: "Not linked" },
  partial: { label: "Partial", color: "warning" },
};

export function CoverageIndicator({
  title = "Coverage",
  sampleSizeLabel,
  systems,
  warnings,
}: CoverageIndicatorProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="text-sm font-semibold">{title}</p>
        {sampleSizeLabel && (
          <p className="text-xs text-muted-foreground">{sampleSizeLabel}</p>
        )}
      </div>

      <div className="space-y-2 text-sm">
        {systems.map((system) => {
          const cfg = STATUS_STYLES[system.status];

          return (
            <div key={system.name} className="flex items-center justify-between">
              <div>
                <p>{system.name}</p>
                {system.lastSync && (
                  <p className="text-xs text-muted-foreground">
                    Last sync: {system.lastSync}
                  </p>
                )}
              </div>
              <Chip size="sm" color={cfg.color}>
                {cfg.label}
              </Chip>
            </div>
          );
        })}
      </div>

      {warnings && warnings.length > 0 && (
        <div className="space-y-1 text-xs text-muted-foreground">
          {warnings.map((warning, index) => (
            <p key={`${warning}-${index}`}>{warning}</p>
          ))}
        </div>
      )}
    </div>
  );
}
