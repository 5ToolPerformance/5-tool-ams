import type { PlayerPerformanceDisciplineData } from "@/application/players/performance/getPlayerPerformanceData.types";
import { PerformanceEvidenceTab } from "@/ui/features/athlete-performance/shared/PerformanceEvidenceTab";

type StrengthPerformanceTabProps = {
  data: PlayerPerformanceDisciplineData;
};

const FEATURED_STRENGTH_KPI_KEYS = [
  "Strength:powerRating",
  "Strength:rotation",
  "Strength:lowerBodyStrength",
  "Strength:upperBodyStrength",
];

export function StrengthPerformanceTab({ data }: StrengthPerformanceTabProps) {
  return (
    <PerformanceEvidenceTab
      data={data}
      title="Strength"
      emptyTitle="No strength evidence yet"
      emptyDescription="Strength evaluation evidence will appear here after strength metrics are recorded on an evaluation."
      featuredKpiKeys={FEATURED_STRENGTH_KPI_KEYS}
    />
  );
}
