import { Suspense } from "react";

import { getPerformanceDocumentsData } from "@/application/players/performance-documents/getPerformanceDocumentsData";
import { HittingPerformanceTab } from "@/ui/features/athlete-performance/hitting/HittingPerformanceTab";
import { ChartAreaSkeleton } from "@/ui/features/athlete-performance/shared/skeletons/ChartAreaSkeleton";

export default async function HittingPerformancePage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;
  const performanceAttachments = await getPerformanceDocumentsData(playerId);

  return (
    <Suspense fallback={<ChartAreaSkeleton />}>
      <HittingPerformanceTab performanceAttachments={performanceAttachments} />
    </Suspense>
  );
}
