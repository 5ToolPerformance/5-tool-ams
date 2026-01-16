// ui/features/athlete-performance/strength/NormalizedMetricCard.tsx
import { Card, CardBody, Chip } from "@heroui/react";

import type { NormalizedMetric } from "./types";

interface NormalizedMetricCardProps {
  metric: NormalizedMetric;
}

function formatDelta(delta?: number) {
  if (delta === undefined || delta === null) {
    return "N/A";
  }
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta}`;
}

export function NormalizedMetricCard({ metric }: NormalizedMetricCardProps) {
  return (
    <Card shadow="sm">
      <CardBody className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="text-2xl font-semibold">
              {metric.value} {metric.unit}
            </p>
          </div>
          <Chip size="sm" variant="flat">
            {metric.percentile}% percentile
          </Chip>
        </div>

        <div className="flex items-center justify-between text-sm text-foreground-500">
          <span>30-day delta</span>
          <span className={metric.delta && metric.delta < 0 ? "text-danger" : ""}>
            {formatDelta(metric.delta)}
          </span>
        </div>

        {metric.sampleSize !== undefined && (
          <p className="text-xs text-muted-foreground">
            Sample size: {metric.sampleSize}
          </p>
        )}
      </CardBody>
    </Card>
  );
}
