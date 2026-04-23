import { getPlayerPerformanceData } from "@ams/application/players/performance/getPlayerPerformanceData";
import { StrengthPerformanceTab } from "@/ui/features/athlete-performance/strength/StrengthPerformanceTab";

export default async function StrengthPerformancePage({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;
  const performance = await getPlayerPerformanceData(playerId);

  return <StrengthPerformanceTab data={performance.strength} />;
}
