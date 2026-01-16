// ui/features/athlete-performance/shared/PerformanceSectionShell.tsx
import type { ReactNode } from "react";

import { Card, CardBody, CardHeader } from "@heroui/react";

interface PerformanceSectionShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function PerformanceSectionShell({
  title,
  description,
  actions,
  children,
}: PerformanceSectionShellProps) {
  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </CardHeader>
      <CardBody className="space-y-4">{children}</CardBody>
    </Card>
  );
}
