// ui/features/overview/OverviewAIInsight.tsx
import { Card, CardBody } from "@heroui/react";

export async function OverviewAIInsight() {
  // feature-flagged in the future
  const enabled = false;

  if (!enabled) return null;

  return (
    <Card shadow="sm">
      <CardBody className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground">
          AI Insight
        </h3>
        <ul className="list-disc pl-4 text-sm">
          <li>Pitching workload has increased this week.</li>
          <li>Monitor shoulder recovery before next session.</li>
        </ul>
      </CardBody>
    </Card>
  );
}
