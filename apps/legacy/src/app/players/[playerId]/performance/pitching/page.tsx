import { PitchingPerformanceTab } from "@/ui/features/athlete-performance/pitching/PitchingPerformanceTab";

export default async function PitchingPerformancePage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  await params;

  return <PitchingPerformanceTab />;
}
