export type LessonType =
  | "pitching"
  | "hitting"
  | "fielding"
  | "strength"
  | "catching";

export type PlayerMechanicEntry = {
  notes?: string;
};

export type PlayerDrillEntry = {
  notes?: string;
};

export type LessonRoutineSource = "player" | "universal";
export type LessonRoutineType = "partial_lesson" | "full_lesson";

export type PlayerRoutineSelection = {
  source: LessonRoutineSource;
  routineId: string;
  routineType: LessonRoutineType;
  title: string;
};

export type PlayerLessonData = {
  lessonPlayerId?: string;
  notes?: string;
  mechanics?: Record<string, PlayerMechanicEntry>;
  drills?: Record<string, PlayerDrillEntry>;
  routineSelections?: PlayerRoutineSelection[];
  lessonSpecific?: {
    pitching?: PitchingLessonData;
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
  severity?: number;
  bodyPartId: string;
};
