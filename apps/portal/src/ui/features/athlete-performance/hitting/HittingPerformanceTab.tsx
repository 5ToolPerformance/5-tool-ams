import type { PlayerPerformanceDisciplineData } from "@ams/application/players/performance/getPlayerPerformanceData.types";
import { PerformanceEvidenceTab } from "@/ui/features/athlete-performance/shared/PerformanceEvidenceTab";

type HittingPerformanceTabProps = {
  data: PlayerPerformanceDisciplineData;
};

const FEATURED_HITTING_KPI_KEYS = [
  "HitTrax:exitVelocityAvg",
  "HitTrax:hardHitPercent",
  "Blast:batSpeedAvg",
  "Blast:onPlanePercent",
];

export function HittingPerformanceTab({ data }: HittingPerformanceTabProps) {
  return (
    <PerformanceEvidenceTab
      data={data}
      title="Hitting"
      emptyTitle="No hitting evidence yet"
      emptyDescription="HitTrax and Blast evaluation evidence will appear here after hitting metrics are recorded on an evaluation."
      featuredKpiKeys={FEATURED_HITTING_KPI_KEYS}
    />
  );
}
