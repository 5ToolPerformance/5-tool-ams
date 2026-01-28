// ui/core/SectionShell.tsx
import type { ReactNode } from "react";

import { Card, CardBody, CardHeader } from "@heroui/react";

interface SectionShellProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SectionShell({
  title,
  description,
  children,
}: SectionShellProps) {
  return (
    <Card shadow="sm">
      <CardHeader className="flex flex-col items-start gap-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
}
