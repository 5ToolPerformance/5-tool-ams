import { ChartAreaSkeleton } from "@/ui/features/athlete-performance/shared/skeletons/ChartAreaSkeleton";
import { StrengthPerformanceTab } from "@/ui/features/athlete-performance/strength/StrengthPerformanceTab";
import { Suspense } from "react";

export default function StrengthPerformancePage() {
  return (
    <Suspense fallback={<ChartAreaSkeleton />}>
      <StrengthPerformanceTab />
    </Suspense>
  );
}
