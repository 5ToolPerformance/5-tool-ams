import type { HittingAtBatInput, HittingOutcome } from "./types";

const NON_AT_BAT_OUTCOMES = new Set<HittingOutcome>(["walk", "hit_by_pitch", "sac_fly", "sac_bunt"]);

export function normalizeAtBats(atBats: HittingAtBatInput[]) {
  return [...atBats]
    .sort((left, right) => left.atBatNumber - right.atBatNumber)
    .map((atBat, index) => ({
      ...atBat,
      atBatNumber: index + 1,
    }));
}

export function getPlateAppearanceCount(atBats: HittingAtBatInput[]) {
  return atBats.length;
}

export function getAtBatCount(atBats: HittingAtBatInput[]) {
  return atBats.filter((atBat) => !NON_AT_BAT_OUTCOMES.has(atBat.outcome)).length;
}

export function getOutcomeCounts(atBats: HittingAtBatInput[]) {
  return atBats.reduce<Record<string, number>>((counts, atBat) => {
    counts[atBat.outcome] = (counts[atBat.outcome] ?? 0) + 1;
    return counts;
  }, {});
}

export function buildHittingSummaryText(atBats: HittingAtBatInput[]) {
  const outcomeCounts = getOutcomeCounts(atBats);
  const priorityOrder: HittingOutcome[] = [
    "home_run",
    "triple",
    "double",
    "single",
    "walk",
    "hit_by_pitch",
    "strikeout",
  ];

  const parts = priorityOrder
    .filter((outcome) => outcomeCounts[outcome] > 0)
    .slice(0, 2)
    .map((outcome) => `${outcomeCounts[outcome]} ${outcome.replaceAll("_", " ")}`);

  return parts.length > 0 ? parts.join(", ") : null;
}
