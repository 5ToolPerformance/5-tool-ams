// ui/features/athlete-performance/strength/StrengthRiskSection.tsx
import { Chip } from "@heroui/react";

import { PerformanceSectionShell } from "@/ui/features/athlete-performance/shared/PerformanceSectionShell";

import { AsymmetryTrendChart } from "./AsymmetryTrendChart";

export function StrengthRiskSection() {
  return (
    <PerformanceSectionShell
      title="Risk Signals"
      description="Neutral thresholds to monitor fatigue and imbalance."
    >
      <div className="flex flex-wrap gap-2 text-xs">
        <Chip size="sm" variant="flat">
          Below 5%: low concern
        </Chip>
        <Chip size="sm" variant="flat">
          5-10%: watch
        </Chip>
        <Chip size="sm" variant="flat">
          Above 10%: address
        </Chip>
      </div>

      <AsymmetryTrendChart />
    </PerformanceSectionShell>
  );
}
