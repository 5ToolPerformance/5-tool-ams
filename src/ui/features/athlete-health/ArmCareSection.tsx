import { Card, CardBody } from "@heroui/react";

import type { HealthArmCareSnapshot } from "@/application/players/health/getHealthTabData";
import { ArmCareProfileCard } from "@/components/players/ArmCareProfileCard";

interface ArmCareSectionProps {
  playerId: string;
  armCare: HealthArmCareSnapshot | null;
}

function formatArmCareDate(date: string) {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString();
}

export function ArmCareSection({ playerId, armCare }: ArmCareSectionProps) {
  if (!armCare) {
    return (
      <Card>
        <CardBody className="py-6">
          <div className="space-y-1">
            <p className="text-base font-semibold">Arm Care Profile</p>
            <p className="text-sm text-muted-foreground">
              No ArmCare exam data is available for this athlete yet.
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <ArmCareProfileCard
      playerId={playerId}
      score={armCare.score}
      date={formatArmCareDate(armCare.date)}
    />
  );
}
