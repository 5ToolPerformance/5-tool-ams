import type { PlayerPerformanceDisciplineData } from "@/application/players/performance/getPlayerPerformanceData.types";
import { PerformanceEmptyState } from "@/ui/features/athlete-performance/shared/PerformanceEmptyState";
import { PerformanceSectionShell } from "@/ui/features/athlete-performance/shared/PerformanceSectionShell";

import { PerformanceKpiGrid } from "./PerformanceKpiGrid";
import { PerformanceSessionViewer } from "./PerformanceSessionViewer";
import { PerformanceTrendCharts } from "./PerformanceTrendCharts";

interface PerformanceEvidenceTabProps {
  data: PlayerPerformanceDisciplineData;
  title: string;
  emptyTitle: string;
  emptyDescription: string;
  featuredKpiKeys?: string[];
}

export function PerformanceEvidenceTab({
  data,
  title,
  emptyTitle,
  emptyDescription,
  featuredKpiKeys,
}: PerformanceEvidenceTabProps) {
  if (data.sessions.length === 0) {
    return (
      <PerformanceEmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  const featuredKpis =
    featuredKpiKeys !== undefined
      ? featuredKpiKeys.flatMap((key) => {
          const kpi = data.kpis.find(
            (item) => `${item.sourceGroup}:${item.key}` === key
          );
          return kpi ? [kpi] : [];
        })
      : data.kpis;

  return (
    <div className="space-y-6">
      <PerformanceSectionShell
        title={`${title} KPIs`}
        description="Latest measured values from evaluation evidence."
      >
        <PerformanceKpiGrid kpis={featuredKpis} />
      </PerformanceSectionShell>

      <PerformanceSectionShell
        title={`${title} Trends`}
        description="Metric history across recorded evaluation evidence sessions."
      >
        <PerformanceTrendCharts
          trends={data.trends}
          featuredTrendKeys={featuredKpiKeys}
        />
      </PerformanceSectionShell>

      <PerformanceSectionShell
        title={`${title} Evaluations`}
        description="Open an evaluation to inspect the full available evidence table."
      >
        <PerformanceSessionViewer sessions={data.sessions} />
      </PerformanceSectionShell>
    </div>
  );
}
