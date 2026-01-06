import { LessonFormValues, LessonType } from "@/hooks/lessons/lessonForm.types";

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

export function normalizeLessonForCreate(
  values: LessonFormValues
): LessonWritePayload {
  if (!values.lessonType) {
    throw new Error("Lesson type is required");
  }

  if (!values.lessonDate) {
    throw new Error("Lesson date is required");
  }

  if (values.selectedPlayerIds.length === 0) {
    throw new Error("At least one player is required");
  }

  const lesson = {
    date: values.lessonDate,
    type: values.lessonType,
    sharedNotes: values.sharedNotes?.general || undefined,
  };

  const participants = values.selectedPlayerIds.map((playerId) => {
    const player = values.players[playerId] ?? {};

    return {
      playerId,
      notes: player.notes || undefined,
      lessonSpecific: player.lessonSpecific ?? undefined,
    };
  });

  const mechanics: LessonWritePayload["mechanics"] = [];

  for (const playerId of values.selectedPlayerIds) {
    const mechanicMap = values.players[playerId]?.mechanics ?? {};

    for (const [mechanicId, entry] of Object.entries(mechanicMap)) {
      mechanics.push({
        playerId,
        mechanicId,
        notes: entry.notes || undefined,
      });
    }
  }

  return {
    lesson,
    participants,
    mechanics,
  };
}
