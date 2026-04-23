import { getPlayerPerformanceData } from "@ams/application/players/performance/getPlayerPerformanceData";
import { HittingPerformanceTab } from "@/ui/features/athlete-performance/hitting/HittingPerformanceTab";

export default async function HittingPerformancePage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;
  const performance = await getPlayerPerformanceData(playerId);

  return <HittingPerformanceTab data={performance.hitting} />;
}
