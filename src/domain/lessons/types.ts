import {
  lessonPlayerFatigue,
  lessonRoutineSourceEnum,
  manualTsIso,
  pitchingLessonPlayers,
} from "@/db/schema";
import { RoutineDocumentV1 } from "@/domain/routines/types";
import {
  FatigueReportData,
  LessonRoutineSource,
  LessonRoutineType,
  LessonType,
  StrengthLessonSpecific,
} from "@/hooks/lessons/lessonForm.types";

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

export type PitchingLessonInsert = typeof pitchingLessonPlayers.$inferInsert;

export function isPitchingLessonSpecific(
  value: unknown
): value is PitchingLessonSpecific {
  return typeof value === "object" && value !== null && "summary" in value;
}

export function isStrengthLessonSpecific(
  data: unknown
): data is StrengthLessonSpecific {
  return !!data && typeof data === "object" && "tsIso" in data;
}

export type TsIsoInsert = typeof manualTsIso.$inferInsert;

export type FatigueReportInsert = typeof lessonPlayerFatigue.$inferInsert;

export type LessonRoutineSourceInsert =
  (typeof lessonRoutineSourceEnum.enumValues)[number];
