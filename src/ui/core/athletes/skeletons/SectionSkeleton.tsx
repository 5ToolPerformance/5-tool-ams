// ui/core/skeletons/SectionSkeleton.tsx
import { Card, CardBody, Skeleton } from "@heroui/react";

export function SectionSkeleton() {
  return (
    <Card shadow="sm">
      <CardBody className="space-y-3">
        <Skeleton className="h-5 w-1/3 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
      </CardBody>
    </Card>
  );
}
