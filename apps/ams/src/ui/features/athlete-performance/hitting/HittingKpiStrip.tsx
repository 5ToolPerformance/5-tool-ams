// ui/features/athlete-performance/hitting/HittingKpiStrip.tsx
import { Card, CardBody, Chip } from "@heroui/react";

import type { HittingKpi } from "./types";

interface HittingKpiStripProps {
  kpis: HittingKpi[];
}

const sourceLabels: Record<HittingKpi["source"], string> = {
  derived: "Derived",
  measured: "Measured",
  placeholder: "Placeholder",
};

function formatValue(value: HittingKpi["value"], unit?: string) {
  if (typeof value === "number") {
    return unit ? `${value} ${unit}` : `${value}`;
  }
  return value;
}

export function HittingKpiStrip({ kpis }: HittingKpiStripProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.key} shadow="sm">
          <CardBody className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-semibold">
                  {formatValue(kpi.value, kpi.unit)}
                </p>
              </div>
              <Chip size="sm" variant="flat">
                {sourceLabels[kpi.source]}
              </Chip>
            </div>
            {kpi.helper && (
              <p className="text-xs text-muted-foreground">{kpi.helper}</p>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
