// ui/features/athlete-performance/shared/PerformanceEmptyState.tsx
import { Card, CardBody } from "@heroui/react";

interface PerformanceEmptyStateProps {
  title?: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function PerformanceEmptyState({
  title = "No data yet",
  description,
  actionLabel,
  actionHref,
}: PerformanceEmptyStateProps) {
  return (
    <Card shadow="sm">
      <CardBody className="space-y-3 text-sm">
        <div className="space-y-1">
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {actionLabel && actionHref && (
          <a
            href={actionHref}
            className="inline-flex w-fit items-center text-sm font-medium text-foreground underline decoration-dotted underline-offset-4 hover:decoration-solid"
          >
            {actionLabel}
          </a>
        )}
      </CardBody>
    </Card>
  );
}
