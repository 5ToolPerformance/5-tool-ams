import { Suspense } from "react";

import { HittingPerformanceTab } from "@/ui/features/athlete-performance/hitting/HittingPerformanceTab";
import { ChartAreaSkeleton } from "@/ui/features/athlete-performance/shared/skeletons/ChartAreaSkeleton";

export default function HittingPerformancePage() {
  return (
    <Suspense fallback={<ChartAreaSkeleton />}>
      <HittingPerformanceTab />
    </Suspense>
  );
}
