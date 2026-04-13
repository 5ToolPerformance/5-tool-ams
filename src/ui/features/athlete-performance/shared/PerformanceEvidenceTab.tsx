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
}

export function PerformanceEvidenceTab({
  data,
  title,
  emptyTitle,
  emptyDescription,
}: PerformanceEvidenceTabProps) {
  if (data.sessions.length === 0) {
    return (
      <PerformanceEmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PerformanceSectionShell
        title={`${title} KPIs`}
        description="Latest measured values from evaluation evidence."
      >
        <PerformanceKpiGrid kpis={data.kpis} />
      </PerformanceSectionShell>

      <PerformanceSectionShell
        title={`${title} Trends`}
        description="Metric history across recorded evaluation evidence sessions."
      >
        <PerformanceTrendCharts trends={data.trends} />
      </PerformanceSectionShell>

      <PerformanceSectionShell
        title={`${title} Sessions`}
        description="Open a session to inspect the full available evidence table."
      >
        <PerformanceSessionViewer sessions={data.sessions} />
      </PerformanceSectionShell>
    </div>
  );
}
