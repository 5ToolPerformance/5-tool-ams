import type { RoutineDocumentV1 } from "../routines/types";

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

export type PitchingLessonData = {
  summary?: string;
  focus?: string;
};

export type FatigueReportData = {
  report: "fatigue" | "injury" | "none";
  severity?: number;
  bodyPartId: string;
};

export type LessonRoutineSelectionWithDocument = PlayerRoutineSelection & {
  document?: RoutineDocumentV1;
};

export type PlayerLessonData = {
  lessonPlayerId?: string;
  notes?: string;
  mechanics?: Record<string, PlayerMechanicEntry>;
  drills?: Record<string, PlayerDrillEntry>;
  routineSelections?: LessonRoutineSelectionWithDocument[];
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
