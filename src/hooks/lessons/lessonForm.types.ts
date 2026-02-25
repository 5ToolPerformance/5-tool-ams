export type LessonType =
  | "pitching"
  | "hitting"
  | "fielding"
  | "strength"
  | "catching";

export type PlayerMechanicEntry = {
  notes?: string;
};

export type PlayerLessonData = {
  lessonPlayerId?: string;
  notes?: string;
  mechanics?: Record<string, PlayerMechanicEntry>;
  lessonSpecific?: {
    pitching?: PitchingLessonData;
    strength?: StrengthLessonSpecific;
  };
  videoAssetId?: string;
  fatigueReport?: FatigueReportData;
};

export type LessonFormValues = {
  lessonType?: LessonType;
  lessonDate?: string;
  selectedPlayerIds: string[];

  players: Record<string, PlayerLessonData>;
  sharedNotes?: {
    general?: string;
  };
};

export type LessonStep =
  | "select-players"
  | "player-notes"
  | "shared-notes"
  | "confirm";

export const LESSON_STEPS: LessonStep[] = [
  "select-players",
  "player-notes",
  "shared-notes",
  "confirm",
];

export type PitchingLessonData = {
  summary?: string;
  focus?: string;
};

export type FatigueReportData = {
  report: "fatigue" | "injury" | "none";
  rating?: number;
  bodyPartId?: string;
};

export type TsIsoData = {
  shoulderErL?: number;
  shoulderErR?: number;
  shoulderErTtpfL?: number;
  shoulderErTtpfR?: number;
  shoulderIrL?: number;
  shoulderIrR?: number;
  shoulderIrTtpfL?: number;
  shoulderIrTtpfR?: number;
  shoulderRotL?: number;
  shoulderRotR?: number;
  shoulderRotRfdL?: number;
  shoulderRotRfdR?: number;
  hipRotL?: number;
  hipRotR?: number;
  hipRotRfdL?: number;
  hipRotRfdR?: number;
};

export type StrengthLessonSpecific = {
  tsIso?: TsIsoData;
};
