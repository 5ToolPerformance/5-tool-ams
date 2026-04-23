import { Suspense } from "react";

import { getHealthTabData } from "@/application/players/health/getHealthTabData";
import { HealthTab } from "@/ui/features/athlete-health/HealthTab";
import { HealthSkeleton } from "@/ui/features/athlete-health/skeletons/HealthSkeleton";

export default async function PlayerHealthPage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;
  const { injuries, armCare } = await getHealthTabData(playerId);

  return (
    <Suspense fallback={<HealthSkeleton />}>
      <HealthTab playerId={playerId} injuries={injuries} armCare={armCare} />
    </Suspense>
  );
}
