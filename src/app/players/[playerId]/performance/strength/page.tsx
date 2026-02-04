import { Suspense } from "react";

import { getPerformanceDocumentsData } from "@/application/players/performance-documents/getPerformanceDocumentsData";
import { ChartAreaSkeleton } from "@/ui/features/athlete-performance/shared/skeletons/ChartAreaSkeleton";
import { StrengthPerformanceTab } from "@/ui/features/athlete-performance/strength/StrengthPerformanceTab";

export default async function StrengthPerformancePage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;
  const performanceAttachments = await getPerformanceDocumentsData(playerId);

  return (
    <Suspense fallback={<ChartAreaSkeleton />}>
      <StrengthPerformanceTab performanceAttachments={performanceAttachments} />
    </Suspense>
  );
}
