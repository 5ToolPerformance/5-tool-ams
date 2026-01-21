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
  notes?: string;
  mechanics?: Record<string, PlayerMechanicEntry>;
  lessonSpecific?: {
    pitching?: PitchingLessonData;
    strength?: StrengthLessonSpecific;
  };
  videoAssetId?: string;
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

export type PitchingPhase = "1" | "2" | "3" | "4";

export type PitchingLessonData = {
  phase?: PitchingPhase;
  pitchCount?: number;
  intentPercent?: number;
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
