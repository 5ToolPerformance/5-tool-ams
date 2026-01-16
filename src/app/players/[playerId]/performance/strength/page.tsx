import { ChartAreaSkeleton } from "@/ui/features/athlete-performance/shared/skeletons/ChartAreaSkeleton";
import { Suspense } from "react";

export default function StrengthPerformancePage() {
  return (
    <Suspense fallback={<ChartAreaSkeleton />}>
      <div>Strength Performance Content</div>
    </Suspense>
  );
}
