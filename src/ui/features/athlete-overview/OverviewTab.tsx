// ui/features/overview/OverviewTab.tsx
import { Suspense } from "react";

import { getOverviewData } from "@/application/players/overview/getOverviewData";
import { SectionSkeleton } from "@/ui/core/athletes/skeletons/SectionSkeleton";
import { CurrentFocusSection } from "@/ui/features/athlete-overview/CurrentFocusSection";
import { RecentActivitySection } from "@/ui/features/athlete-overview/RecentActivitySection";
import { PlayerNotesSection } from "@/ui/features/notes";

interface OverviewTabProps {
  notes: Awaited<ReturnType<typeof getOverviewData>>["notes"];
  currentFocus: Awaited<ReturnType<typeof getOverviewData>>["currentFocus"];
  recentActivity: Awaited<ReturnType<typeof getOverviewData>>["recentActivity"];
}

export async function OverviewTab({
  notes,
  currentFocus,
  recentActivity,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <Suspense fallback={<SectionSkeleton />}>
        <CurrentFocusSection data={currentFocus} />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <PlayerNotesSection notes={notes} />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <RecentActivitySection items={recentActivity} />
      </Suspense>

      {/* <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<SectionSkeleton />}>
          <PerformanceSnapshot />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <SystemConfidence />
        </Suspense>
      </div> */}
    </div>
  );
}
