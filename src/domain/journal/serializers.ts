import { buildHittingSummaryText, getAtBatCount, getOutcomeCounts, getPlateAppearanceCount, normalizeAtBats } from "./hitting";
import {
  buildThrowingDailySummarySnapshot,
  computeThrowingWorkloadUnits,
  getTotalPitchCount,
  getTotalThrowCount,
  hasBullpenExposure,
  hasGameExposure,
  summarizeLatestArmCheckin,
} from "./throwing";
import type {
  CreateHittingJournalEntryInput,
  CreateJournalEntryInput,
  CreateThrowingJournalEntryInput,
  HittingAtBatInput,
  HittingJournalEntryDetail,
  JournalEntryDetail,
  JournalEntryEditPayload,
  JournalEntryListItem,
  JournalEntrySummaryHighlight,
  ThrowingArmCheckinInput,
  ThrowingJournalEntryDetail,
  ThrowingWorkloadSegmentInput,
} from "./types";

function capitalizeLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function buildThrowingHighlights(
  segments: ThrowingWorkloadSegmentInput[],
  armCheckin: ThrowingArmCheckinInput | null
): JournalEntrySummaryHighlight[] {
  const highlights: JournalEntrySummaryHighlight[] = [
    { label: `${getTotalThrowCount(segments)} throws`, tone: "primary" },
    { label: `${segments.length} segment${segments.length === 1 ? "" : "s"}` },
  ];

  const totalPitchCount = getTotalPitchCount(segments);
  if (totalPitchCount > 0) {
    highlights.push({ label: `${totalPitchCount} pitches` });
  }

  if (hasBullpenExposure(segments)) {
    highlights.push({ label: "Bullpen", tone: "warning" });
  }

  if (hasGameExposure(segments)) {
    highlights.push({ label: "Game", tone: "warning" });
  }

  if (armCheckin && armCheckin.armSoreness !== null) {
    highlights.push({ label: `Arm soreness ${armCheckin.armSoreness}/5` });
  }

  return highlights.slice(0, 4);
}

export function buildHittingHighlights(atBats: HittingAtBatInput[]): JournalEntrySummaryHighlight[] {
  const counts = getOutcomeCounts(atBats);
  const highlights: JournalEntrySummaryHighlight[] = [
    { label: `${getAtBatCount(atBats)} AB`, tone: "primary" },
    { label: `${getPlateAppearanceCount(atBats)} PA` },
  ];

  for (const key of ["single", "double", "triple", "home_run", "walk", "strikeout"] as const) {
    if (counts[key]) {
      highlights.push({
        label: `${counts[key]} ${capitalizeLabel(key)}`,
        tone: key === "strikeout" ? "warning" : "success",
      });
    }
  }

  return highlights.slice(0, 4);
}

export function buildJournalListItem(detail: JournalEntryDetail): JournalEntryListItem {
  return {
    id: detail.id,
    playerId: detail.playerId,
    entryDate: detail.entryDate,
    entryType: detail.entryType,
    contextType: detail.contextType,
    title: detail.title,
    summary:
      detail.entryType === "throwing"
        ? detail.sessionNote ?? detail.summaryNote
        : detail.hittingSummaryNote ?? detail.summaryNote ?? buildHittingSummaryText(detail.atBats),
    createdOn: detail.createdOn,
    highlights: detail.highlights,
  };
}

export function serializeCreateThrowingInput(
  input: CreateThrowingJournalEntryInput
): CreateThrowingJournalEntryInput {
  return {
    ...input,
    workloadSegments: input.workloadSegments,
    armCheckin: input.armCheckin,
  };
}

export function serializeCreateHittingInput(
  input: CreateHittingJournalEntryInput
): CreateHittingJournalEntryInput {
  return {
    ...input,
    atBats: normalizeAtBats(input.atBats),
  };
}

export function serializeCreateJournalEntryInput(
  input: CreateJournalEntryInput
): CreateJournalEntryInput {
  return input.entryType === "throwing"
    ? serializeCreateThrowingInput(input)
    : serializeCreateHittingInput(input);
}

export function toJournalEntryEditPayload(detail: JournalEntryDetail): JournalEntryEditPayload {
  if (detail.entryType === "throwing") {
    return {
      id: detail.id,
      playerId: detail.playerId,
      entryType: "throwing",
      entryDate: detail.entryDate,
      contextType: detail.contextType,
      title: detail.title,
      summaryNote: detail.summaryNote,
      overallFeel: detail.overallFeel,
      confidenceScore: detail.confidenceScore,
      sessionNote: detail.sessionNote,
      workloadSegments: detail.workloadSegments.map(({ id: _id, ...segment }) => segment),
      armCheckin: detail.armCheckin,
    };
  }

  return {
    id: detail.id,
    playerId: detail.playerId,
    entryType: "hitting",
    entryDate: detail.entryDate,
    contextType: detail.contextType,
    title: detail.title,
    summaryNote: detail.summaryNote,
    opponent: detail.opponent,
    teamName: detail.teamName,
    location: detail.location,
    overallFeel: detail.overallFeel,
    confidenceScore: detail.confidenceScore,
    hittingSummaryNote: detail.hittingSummaryNote,
    atBats: detail.atBats.map(({ id: _id, ...atBat }) => atBat),
  };
}

export function createThrowingDetail(params: Omit<ThrowingJournalEntryDetail, "highlights">) {
  return {
    ...params,
    highlights: buildThrowingHighlights(params.workloadSegments, params.armCheckin),
  } satisfies ThrowingJournalEntryDetail;
}

export function createHittingDetail(params: Omit<HittingJournalEntryDetail, "highlights">) {
  return {
    ...params,
    highlights: buildHittingHighlights(params.atBats),
  } satisfies HittingJournalEntryDetail;
}

export function buildThrowingSummaryText(segments: ThrowingWorkloadSegmentInput[]) {
  const units = computeThrowingWorkloadUnits(segments);
  const values = [`${getTotalThrowCount(segments)} throws`, `${units} workload units`];
  return values.join(" • ");
}

export function buildThrowingDailySummaryFromInputs(params: {
  playerId: string;
  summaryDate: string;
  entryCount: number;
  segments: ThrowingWorkloadSegmentInput[];
  armCheckins: Array<ThrowingArmCheckinInput | null>;
}) {
  return buildThrowingDailySummarySnapshot(params);
}

export function buildArmStatusSummary(armCheckin: ThrowingArmCheckinInput | null) {
  if (!armCheckin) {
    return null;
  }

  const summary = summarizeLatestArmCheckin([armCheckin]);
  if (summary.sorenessScore === null && summary.fatigueScore === null) {
    return null;
  }

  return [
    summary.sorenessScore !== null ? `Soreness ${summary.sorenessScore}/5` : null,
    summary.fatigueScore !== null ? `Fatigue ${summary.fatigueScore}/5` : null,
  ]
    .filter(Boolean)
    .join(" • ");
}
