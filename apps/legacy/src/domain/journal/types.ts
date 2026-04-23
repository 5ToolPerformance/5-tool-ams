import type {
  hittingOutcomeEnum,
  journalContextTypeEnum,
  journalEntryTypeEnum,
  throwIntentEnum,
  throwTypeEnum,
  workloadQualityEnum,
} from "@/db/schema";

export type JournalEntryType = (typeof journalEntryTypeEnum.enumValues)[number];
export type SupportedJournalEntryType = Extract<JournalEntryType, "throwing" | "hitting">;
export type JournalContextType = (typeof journalContextTypeEnum.enumValues)[number];
export type ThrowType = (typeof throwTypeEnum.enumValues)[number];
export type ThrowIntent = (typeof throwIntentEnum.enumValues)[number];
export type HittingOutcome = (typeof hittingOutcomeEnum.enumValues)[number];
export type WorkloadQuality = (typeof workloadQualityEnum.enumValues)[number];
export type JournalFeedFilter = "all" | SupportedJournalEntryType;

export type JournalEntrySummaryHighlight = {
  label: string;
  tone?: "default" | "primary" | "success" | "warning";
};

export type JournalEntryListItem = {
  id: string;
  playerId: string;
  entryDate: string;
  entryType: SupportedJournalEntryType;
  contextType: JournalContextType | null;
  title: string | null;
  summary: string | null;
  createdOn: string;
  highlights: JournalEntrySummaryHighlight[];
};

export type ThrowingWorkloadSegmentInput = {
  throwType: ThrowType;
  throwCount: number;
  pitchCount: number | null;
  intentLevel: ThrowIntent | null;
  velocityAvg: number | null;
  velocityMax: number | null;
  pitchType: string | null;
  durationMinutes: number | null;
  notes: string | null;
  isEstimated: boolean;
};

export type ThrowingArmCheckinInput = {
  armSoreness: number | null;
  bodyFatigue: number | null;
  armFatigue: number | null;
  recoveryScore: number | null;
  feelsOff: boolean | null;
  statusNote: string | null;
};

export type HittingAtBatInput = {
  atBatNumber: number;
  outcome: HittingOutcome;
  resultCategory: string | null;
  pitchTypeSeen: string | null;
  pitchLocation: string | null;
  countAtResult: string | null;
  runnersInScoringPosition: boolean | null;
  rbi: number | null;
  notes: string | null;
};

export type JournalEntryBaseInput = {
  playerId: string;
  entryDate: string;
  contextType: JournalContextType | null;
  title: string | null;
  summaryNote: string | null;
};

export type CreateThrowingJournalEntryInput = JournalEntryBaseInput & {
  entryType: "throwing";
  overallFeel: number | null;
  confidenceScore: number | null;
  sessionNote: string | null;
  workloadSegments: ThrowingWorkloadSegmentInput[];
  armCheckin: ThrowingArmCheckinInput | null;
};

export type UpdateThrowingJournalEntryInput = CreateThrowingJournalEntryInput & {
  id: string;
};

export type CreateHittingJournalEntryInput = JournalEntryBaseInput & {
  entryType: "hitting";
  opponent: string | null;
  teamName: string | null;
  location: string | null;
  overallFeel: number | null;
  confidenceScore: number | null;
  hittingSummaryNote: string | null;
  atBats: HittingAtBatInput[];
};

export type UpdateHittingJournalEntryInput = CreateHittingJournalEntryInput & {
  id: string;
};

export type CreateJournalEntryInput =
  | CreateThrowingJournalEntryInput
  | CreateHittingJournalEntryInput;

export type UpdateJournalEntryInput =
  | UpdateThrowingJournalEntryInput
  | UpdateHittingJournalEntryInput;

export type ThrowingWorkloadSegmentDetail = ThrowingWorkloadSegmentInput & {
  id: string;
};

export type ThrowingJournalEntryDetail = {
  id: string;
  playerId: string;
  entryType: "throwing";
  entryDate: string;
  contextType: JournalContextType | null;
  title: string | null;
  summaryNote: string | null;
  createdOn: string;
  updatedOn: string;
  overallFeel: number | null;
  confidenceScore: number | null;
  sessionNote: string | null;
  workloadSegments: ThrowingWorkloadSegmentDetail[];
  armCheckin: ThrowingArmCheckinInput | null;
  highlights: JournalEntrySummaryHighlight[];
};

export type HittingAtBatDetail = HittingAtBatInput & {
  id: string;
};

export type HittingJournalEntryDetail = {
  id: string;
  playerId: string;
  entryType: "hitting";
  entryDate: string;
  contextType: JournalContextType | null;
  title: string | null;
  summaryNote: string | null;
  createdOn: string;
  updatedOn: string;
  opponent: string | null;
  teamName: string | null;
  location: string | null;
  overallFeel: number | null;
  confidenceScore: number | null;
  hittingSummaryNote: string | null;
  atBats: HittingAtBatDetail[];
  highlights: JournalEntrySummaryHighlight[];
};

export type JournalEntryDetail =
  | ThrowingJournalEntryDetail
  | HittingJournalEntryDetail;

export type JournalEntryEditPayload = CreateJournalEntryInput & {
  id: string;
};

export type ThrowingDailySummarySnapshot = {
  playerId: string;
  summaryDate: string;
  totalThrowCount: number;
  totalPitchCount: number;
  workloadUnits: number;
  workloadQuality: WorkloadQuality;
  workloadConfidence: number | null;
  sorenessScore: number | null;
  fatigueScore: number | null;
  entryCount: number;
  hasGameExposure: boolean;
  hasBullpen: boolean;
  hasHighIntentExposure: boolean;
};
