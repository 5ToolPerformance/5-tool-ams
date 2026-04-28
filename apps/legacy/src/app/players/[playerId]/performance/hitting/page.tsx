import { getPlayerPerformanceData } from "@/application/players/performance/getPlayerPerformanceData";
import { HittingPerformanceTab } from "@/ui/features/athlete-performance/hitting/HittingPerformanceTab";

export const dynamic = "force-dynamic";

export default async function HittingPerformancePage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;
  const performance = await getPlayerPerformanceData(playerId);

  return <HittingPerformanceTab data={performance.hitting} />;
}
