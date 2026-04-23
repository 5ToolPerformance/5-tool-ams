import { Card, CardBody, Chip } from "@heroui/react";

import type { PerformanceKpi } from "@/application/players/performance/getPlayerPerformanceData.types";

interface PerformanceKpiGridProps {
  kpis: PerformanceKpi[];
}

function formatValue(kpi: PerformanceKpi) {
  const rounded = Number.isInteger(kpi.value)
    ? String(kpi.value)
    : kpi.value.toFixed(1);

  return kpi.unit ? `${rounded} ${kpi.unit}` : rounded;
}

export function PerformanceKpiGrid({ kpis }: PerformanceKpiGridProps) {
  if (kpis.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-divider p-4 text-sm text-muted-foreground">
        No KPI values are available yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={`${kpi.sourceGroup}-${kpi.key}`} shadow="sm">
          <CardBody className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-semibold">{formatValue(kpi)}</p>
              </div>
              <Chip size="sm" variant="flat">
                {kpi.sourceGroup}
              </Chip>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
