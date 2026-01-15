// app/players/[playerId]/overview/page.tsx
import { Suspense } from "react";

import { OverviewTab } from "@/ui/features/athlete-overview/OverviewTab";
import { OverviewSkeleton } from "@/ui/features/athlete-overview/skeletons/OverviewSkeleton";

// -----------------------------------------------------------------------------
// Fake data (replace later with real loaders)
// -----------------------------------------------------------------------------

async function getFakePlayer(id: string) {
  return {
    id: id,
    name: "John Doe",
    age: 16,
    handedness: "R/R",
    roles: "OF / RHP",
    statuses: ["Active"],
    canEdit: true,
  };
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

interface PlayerOverviewPageProps {
  params: {
    id: string;
  };
}

export default async function PlayerOverviewPage({
  params,
}: PlayerOverviewPageProps) {
  const player = await getFakePlayer(params.id);

  return (
    <Suspense fallback={<OverviewSkeleton />}>
      <OverviewTab />
    </Suspense>
  );
}
