import { pitchingLessonPlayers } from "@/db/schema";
import { LessonType } from "@/hooks/lessons/lessonForm.types";

export type LessonWritePayload = {
  lesson: {
    date: string;
    type: LessonType;
    sharedNotes?: string;
  };

  participants: {
    playerId: string;
    notes?: string;
    lessonSpecific?: unknown;
  }[];

  mechanics: {
    playerId: string;
    mechanicId: string;
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
    notes?: string;
    lessonSpecific?: unknown;
  }[];

  mechanics: {
    playerId: string;
    mechanicId: string;
    notes?: string;
  }[];
};

// Lesson Specific Payload for Pitching Lessons
export type PitchingLessonSpecific = {
  phase: string;
  pitchCount?: number;
  intentPercent?: number;
};

export type PitchingLessonInsert = typeof pitchingLessonPlayers.$inferInsert;

export function isPitchingLessonSpecific(
  value: unknown
): value is PitchingLessonSpecific {
  return typeof value === "object" && value !== null && "phase" in value;
}
