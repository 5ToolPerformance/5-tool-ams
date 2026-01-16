// ui/features/athlete-performance/shared/skeletons/HeaderControlsSkeleton.tsx
import { Card, CardBody, Skeleton } from "@heroui/react";

export function HeaderControlsSkeleton() {
  return (
    <Card shadow="sm">
      <CardBody className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40 rounded-md" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-48 rounded-md" />
            <Skeleton className="h-8 w-40 rounded-md" />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Skeleton className="h-10 w-72 rounded-md" />
          <Skeleton className="h-12 w-60 rounded-md" />
        </div>
      </CardBody>
    </Card>
  );
}
