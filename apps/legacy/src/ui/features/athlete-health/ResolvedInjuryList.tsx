import type { HealthInjury } from "@/application/players/health/getHealthTabData";

import { InjuryCard } from "./InjuryCard";

interface ResolvedInjuryListProps {
  injuries: HealthInjury[];
}

export function ResolvedInjuryList({ injuries }: ResolvedInjuryListProps) {
  if (injuries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No resolved injuries in player history.
      </p>
    );
  }

  return (
    <details className="rounded-medium border border-divider p-4">
      <summary className="cursor-pointer text-sm font-semibold">
        Resolved Injuries ({injuries.length})
      </summary>
      <div className="mt-4 space-y-3">
        {injuries.map((injury) => (
          <InjuryCard key={injury.id} injury={injury} isResolved />
        ))}
      </div>
    </details>
  );
}
