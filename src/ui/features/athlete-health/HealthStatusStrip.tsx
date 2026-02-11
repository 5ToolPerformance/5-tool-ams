import { Card, CardBody, Chip } from "@heroui/react";

interface HealthStatusStripProps {
  activeInjuryCount: number;
  hasLimited: boolean;
}

export function HealthStatusStrip({
  activeInjuryCount,
  hasLimited,
}: HealthStatusStripProps) {
  return (
    <Card>
      <CardBody className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active injuries</span>
          <Chip variant="flat" size="sm">
            {activeInjuryCount}
          </Chip>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Limited status</span>
          <Chip
            variant="flat"
            size="sm"
            color={hasLimited ? "warning" : "success"}
          >
            {hasLimited ? "Limited" : "No current limits"}
          </Chip>
        </div>
      </CardBody>
    </Card>
  );
}
