// ui/core/PlayerHeader.tsx
import type { ReactNode } from "react";

import { Card, CardBody } from "@heroui/react";

interface AthleteHeaderProps {
  children: ReactNode;
}

export function AthleteHeader({ children }: AthleteHeaderProps) {
  return (
    <Card shadow="sm">
      <CardBody className="flex flex-col gap-4">{children}</CardBody>
    </Card>
  );
}
