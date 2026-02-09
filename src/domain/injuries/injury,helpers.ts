import { Injury } from "@/domain/injuries/injury.types";

export function getSideLabel(side: Injury["side"]): string {
  switch (side) {
    case "left":
      return "L";
    case "right":
      return "R";
    case "bilateral":
      return "Bilateral";
    default:
      return "";
  }
}

export function formatInjuryLabel(injury: Injury) {
  const sideLabel = getSideLabel(injury.side);

  if (injury.focusArea) {
    return sideLabel ? `${sideLabel} ${injury.focusArea}` : injury.focusArea;
  }

  return sideLabel ? `${sideLabel} ${injury.bodyPart}` : injury.bodyPart;
}
