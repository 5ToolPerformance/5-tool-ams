// ui/features/athlete-performance/pitching/PitchingWorkloadSection.tsx
import { PerformanceSectionShell } from "@/ui/features/athlete-performance/shared/PerformanceSectionShell";

import { WorkloadTrendChart } from "./WorkloadTrendChart";
import { AcuteChronicRatioPanel } from "./AcuteChronicRatioPanel";

export function PitchingWorkloadSection() {
  return (
    <PerformanceSectionShell
      title="Workload & Risk"
      description="ArmCare-derived workload context and balance."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <WorkloadTrendChart />
        <AcuteChronicRatioPanel />
      </div>
    </PerformanceSectionShell>
  );
}
