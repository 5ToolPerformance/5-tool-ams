import { Injury } from "@/domain/injuries/injury.types";

export function canResolveInjury(injury: Injury) {
  return injury.status !== "resolved";
}

export function isInjuryActiveAtDate(injury: Injury, date: string) {
  return (
    injury.startDate <= date && (!injury.endDate || injury.endDate >= date)
  );
}
