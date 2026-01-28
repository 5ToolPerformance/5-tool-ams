// ui/features/athlete-performance/pitching/PitchingKpiStrip.tsx
import { Card, CardBody, Chip } from "@heroui/react";

import type { PitchingKpi } from "./types";

interface PitchingKpiStripProps {
  kpis: PitchingKpi[];
}

const sourceLabels: Record<PitchingKpi["source"], string> = {
  derived: "Derived",
  measured: "Measured",
  placeholder: "Placeholder",
};

function formatValue(value: PitchingKpi["value"], unit?: string) {
  if (typeof value === "number") {
    return unit ? `${value} ${unit}` : `${value}`;
  }
  return value;
}

export function PitchingKpiStrip({ kpis }: PitchingKpiStripProps) {
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
