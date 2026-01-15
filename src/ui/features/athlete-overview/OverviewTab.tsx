// ui/features/overview/OverviewTab.tsx
import { Suspense } from "react";

import { SectionSkeleton } from "@/ui/core/athletes/skeletons/SectionSkeleton";
import { CurrentFocusSection } from "@/ui/features/athlete-overview/CurrentFocusSection";
import { OverviewAIInsight } from "@/ui/features/athlete-overview/OverviewAIInsight";
import { PerformanceSnapshot } from "@/ui/features/athlete-overview/PerformanceSnapshot";
import { RecentActivitySection } from "@/ui/features/athlete-overview/RecentActivitySection";
import { SystemConfidence } from "@/ui/features/athlete-overview/SystemConfidence";

export async function OverviewTab() {
  // later: const data = await getOverviewData(playerId)

  return (
    <div className="space-y-6">
      <OverviewAIInsight />

      <Suspense fallback={<SectionSkeleton />}>
        <CurrentFocusSection />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <RecentActivitySection />
      </Suspense>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<SectionSkeleton />}>
          <PerformanceSnapshot />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <SystemConfidence />
        </Suspense>
      </div>
    </div>
  );
}
