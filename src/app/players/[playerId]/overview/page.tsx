// app/players/[playerId]/overview/page.tsx
import { Suspense } from "react";

import { getOverviewData } from "@/application/players/overview/getOverviewData";
import { OverviewTab } from "@/ui/features/athlete-overview/OverviewTab";
import { OverviewSkeleton } from "@/ui/features/athlete-overview/skeletons/OverviewSkeleton";

export default async function PlayerOverviewPage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;
  const { currentFocus, recentActivity, notes } =
    await getOverviewData(playerId);
  return (
    <Suspense fallback={<OverviewSkeleton />}>
      <OverviewTab
        notes={notes}
        currentFocus={currentFocus}
        recentActivity={recentActivity}
      />
    </Suspense>
  );
}
