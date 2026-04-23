import { RoutineDocumentV1 } from "../routines/types";
import {
  FatigueReportData,
  LessonFormValues,
  LessonRoutineSource,
  LessonRoutineType,
  LessonType,
} from "./form";

export type LessonWritePayload = {
  lesson: {
    date: string;
    type: LessonType;
    sharedNotes?: string;
  };

  participants: {
    playerId: string;
    notes?: string;
    routineSelections?: {
      source: LessonRoutineSource;
      routineId: string;
      routineType: LessonRoutineType;
      title: string;
      document?: RoutineDocumentV1;
    }[];
    lessonSpecific?: unknown;
    fatigueReport?: FatigueReportData;
  }[];

  mechanics: {
    playerId: string;
    mechanicId: string;
    notes?: string;
  }[];

  drills: {
    playerId: string;
    drillId: string;
    notes?: string;
  }[];
};

export type LessonReadModel = {
  lesson: {
    id: string;
    date: string;
    type: LessonType;
    sharedNotes?: string;
  };

  participants: {
    playerId: string;
    lessonPlayerId?: string;
    notes?: string;
    routineSelections?: {
      source: LessonRoutineSource;
      routineId: string;
      routineType: LessonRoutineType;
      title: string;
      document: RoutineDocumentV1;
    }[];
    lessonSpecific?: unknown;
    fatigueReport?: FatigueReportData;
  }[];

  mechanics: {
    playerId: string;
    mechanicId: string;
    notes?: string;
  }[];

  drills: {
    playerId: string;
    drillId: string;
    notes?: string;
  }[];
};

// Lesson Specific Payload for Pitching Lessons
export type PitchingLessonSpecific = {
  summary: string;
  focus?: string;
};

export type PitchingLessonInsert = {
  lessonPlayerId: string;
  summary: string;
  focus?: string | null;
};

export function isPitchingLessonSpecific(
  value: unknown
): value is PitchingLessonSpecific {
  return typeof value === "object" && value !== null && "summary" in value;
}

export type FatigueReportInsert = {
  lessonPlayerId: string;
  report: string;
  bodyPartId: string;
  severity?: number | null;
};

export type LessonRoutineSourceInsert = LessonRoutineSource;

export type { LessonFormValues };
