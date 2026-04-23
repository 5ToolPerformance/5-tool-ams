import { Button, Card, CardBody, CardHeader } from "@heroui/react";

import type { HealthInjury } from "@/application/players/health/getHealthTabData";
import { AddPlayerInjuryModal } from "@/ui/core/athletes/AddPlayerInjuryModal";

import { InjuryCard } from "./InjuryCard";
import { ResolvedInjuryList } from "./ResolvedInjuryList";

interface InjuryLogSectionProps {
  playerId: string;
  activeInjuries: HealthInjury[];
  resolvedInjuries: HealthInjury[];
}

export function InjuryLogSection({
  playerId,
  activeInjuries,
  resolvedInjuries,
}: InjuryLogSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Injury Log</h2>
          <p className="text-sm text-muted-foreground">
            Active and historical injury context for this athlete.
          </p>
        </div>

        <AddPlayerInjuryModal
          playerId={playerId}
          trigger={<Button color="primary">Add Injury</Button>}
        />
      </CardHeader>

      <CardBody className="space-y-4">
        {activeInjuries.length > 0 ? (
          <div className="space-y-3">
            {activeInjuries.map((injury) => (
              <InjuryCard key={injury.id} injury={injury} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No active injuries are currently recorded.
          </p>
        )}

        <ResolvedInjuryList injuries={resolvedInjuries} />
      </CardBody>
    </Card>
  );
}
