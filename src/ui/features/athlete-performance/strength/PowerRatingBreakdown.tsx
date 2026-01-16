// ui/features/athlete-performance/strength/PowerRatingBreakdown.tsx
import { PerformanceSectionShell } from "@/ui/features/athlete-performance/shared/PerformanceSectionShell";

import type { PowerRating } from "./types";

interface PowerRatingBreakdownProps {
  rating?: PowerRating;
  isExpanded?: boolean;
}

export function PowerRatingBreakdown({
  rating,
  isExpanded = false,
}: PowerRatingBreakdownProps) {
  if (!rating || !isExpanded) {
    return null;
  }

  return (
    <PerformanceSectionShell
      title="Power Rating Breakdown"
      description="Component contributions and weights."
    >
      <div className="space-y-2 text-sm">
        {rating.components.map((component) => (
          <div
            key={component.key}
            className="flex items-center justify-between border-b border-divider pb-2 last:border-b-0 last:pb-0"
          >
            <div>
              <p className="font-medium">{component.key}</p>
              <p className="text-xs text-muted-foreground">
                Weight: {component.weight}%
              </p>
            </div>
            <span className="text-sm">{component.contribution} pts</span>
          </div>
        ))}
      </div>
    </PerformanceSectionShell>
  );
}
