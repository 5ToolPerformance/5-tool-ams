import type {
  HealthArmCareSnapshot,
  HealthInjury,
} from "@/application/players/health/getHealthTabData";

import { ArmCareSection } from "./ArmCareSection";
import { HealthStatusStrip } from "./HealthStatusStrip";
import { InjuryLogSection } from "./InjuryLogSection";

interface HealthTabProps {
  playerId: string;
  injuries: HealthInjury[];
  armCare: HealthArmCareSnapshot | null;
}

export async function HealthTab({ playerId, injuries, armCare }: HealthTabProps) {
  const activeInjuries = injuries.filter((injury) => injury.status !== "resolved");
  const resolvedInjuries = injuries.filter((injury) => injury.status === "resolved");
  const hasLimited = activeInjuries.some((injury) => injury.status === "limited");

  const sortedResolvedInjuries = [...resolvedInjuries].sort((a, b) => {
    const aTime = a.endDate ? Date.parse(a.endDate) : 0;
    const bTime = b.endDate ? Date.parse(b.endDate) : 0;
    return bTime - aTime;
  });

  return (
    <div className="space-y-6">
      <ArmCareSection playerId={playerId} armCare={armCare} />
      <HealthStatusStrip
        activeInjuryCount={activeInjuries.length}
        hasLimited={hasLimited}
      />
      <InjuryLogSection
        playerId={playerId}
        activeInjuries={activeInjuries}
        resolvedInjuries={sortedResolvedInjuries}
      />
    </div>
  );
}
