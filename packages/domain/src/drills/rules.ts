import { DRILL_DISCIPLINES, DrillDiscipline } from "@/domain/drills/types";

export function canCoachEditDrill(createdBy: string, userId: string) {
  return createdBy === userId;
}

export function isImageMime(mimeType: string) {
  return mimeType.startsWith("image/");
}

export function isVideoMime(mimeType: string) {
  return mimeType.startsWith("video/");
}

export function assertDrillDiscipline(value: string): DrillDiscipline {
  if (DRILL_DISCIPLINES.includes(value as DrillDiscipline)) {
    return value as DrillDiscipline;
  }
  throw new Error(`Invalid drill discipline in data: ${value}`);
}
