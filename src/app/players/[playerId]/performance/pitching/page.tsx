import { Suspense } from "react";

import { getPerformanceDocumentsData } from "@/application/players/performance-documents/getPerformanceDocumentsData";
import { PitchingPerformanceTab } from "@/ui/features/athlete-performance/pitching/PitchingPerformanceTab";
import { ChartAreaSkeleton } from "@/ui/features/athlete-performance/shared/skeletons/ChartAreaSkeleton";

export default async function PitchingPerformancePage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;
  const performanceAttachments = await getPerformanceDocumentsData(playerId);

  return (
    <Suspense fallback={<ChartAreaSkeleton />}>
      <PitchingPerformanceTab performanceAttachments={performanceAttachments} />
    </Suspense>
  );
}
