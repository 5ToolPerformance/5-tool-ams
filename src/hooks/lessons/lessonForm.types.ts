export type LessonType =
  | "pitching"
  | "hitting"
  | "fielding"
  | "strength"
  | "catching";

export type PlayerLessonData = {
  notes?: string;
  mechanics?: string[];
  lessonSpecific?: {
    pitching?: PitchingLessonData;
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
    drills?: string;
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
