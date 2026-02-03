// ui/features/overview/OverviewTab.tsx
import { Suspense } from "react";

import { getOverviewData } from "@/application/players/overview/getOverviewData";
import { SectionSkeleton } from "@/ui/core/athletes/skeletons/SectionSkeleton";
import { PlayerAttachmentsViewer } from "@/ui/features/athlete-overview/AttatchmentOverviewSection";
import { CurrentFocusSection } from "@/ui/features/athlete-overview/CurrentFocusSection";
import { RecentActivitySection } from "@/ui/features/athlete-overview/RecentActivitySection";
import { PlayerNotesSection } from "@/ui/features/notes";

interface OverviewTabProps {
  notes: Awaited<ReturnType<typeof getOverviewData>>["notes"];
  currentFocus: Awaited<ReturnType<typeof getOverviewData>>["currentFocus"];
  recentActivity: Awaited<ReturnType<typeof getOverviewData>>["recentActivity"];
  attachments: Awaited<ReturnType<typeof getOverviewData>>["attachments"];
}

export async function OverviewTab({
  notes,
  currentFocus,
  recentActivity,
  attachments,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <Suspense fallback={<SectionSkeleton />}>
        <CurrentFocusSection data={currentFocus} />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <PlayerNotesSection notes={notes} />
      </Suspense>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense fallback={<SectionSkeleton />}>
          <RecentActivitySection items={recentActivity} />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <PlayerAttachmentsViewer attachments={attachments} />
        </Suspense>
      </div>
    </div>
  );
}
