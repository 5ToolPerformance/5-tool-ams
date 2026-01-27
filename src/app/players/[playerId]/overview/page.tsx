// app/players/[playerId]/overview/page.tsx
import { Suspense } from "react";

import { OverviewTab } from "@/ui/features/athlete-overview/OverviewTab";
import { OverviewSkeleton } from "@/ui/features/athlete-overview/skeletons/OverviewSkeleton";

export default async function PlayerOverviewPage() {
  return (
    <Suspense fallback={<OverviewSkeleton />}>
      <OverviewTab />
    </Suspense>
  );
}
