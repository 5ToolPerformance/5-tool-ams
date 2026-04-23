// ui/features/athlete-performance/shared/skeletons/ChartAreaSkeleton.tsx
import { Card, CardBody, Skeleton } from "@heroui/react";

export function ChartAreaSkeleton() {
  return (
    <Card shadow="sm">
      <CardBody className="space-y-3">
        <Skeleton className="h-5 w-48 rounded-md" />
        <Skeleton className="h-56 w-full rounded-md" />
      </CardBody>
    </Card>
  );
}
