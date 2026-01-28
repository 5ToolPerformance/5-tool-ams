import { Suspense } from "react";

import { PitchingPerformanceTab } from "@/ui/features/athlete-performance/pitching/PitchingPerformanceTab";
import { ChartAreaSkeleton } from "@/ui/features/athlete-performance/shared/skeletons/ChartAreaSkeleton";

export default function PitchingPerformancePage() {
  return (
    <Suspense fallback={<ChartAreaSkeleton />}>
      <PitchingPerformanceTab />
    </Suspense>
  );
}
