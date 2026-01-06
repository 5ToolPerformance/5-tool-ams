import { LessonFormValues, LessonType } from "@/hooks/lessons/lessonForm.types";

type LessonReadModel = {
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

export function hydrateLessonForm(read: LessonReadModel): LessonFormValues {
  const values: LessonFormValues = {
    lessonType: read.lesson.type,
    lessonDate: read.lesson.date,
    selectedPlayerIds: [],
    players: {},
  };

  if (read.lesson.sharedNotes) {
    values.sharedNotes = {
      general: read.lesson.sharedNotes,
    };
  }

  for (const participant of read.participants) {
    const { playerId, notes, lessonSpecific } = participant;

    values.selectedPlayerIds.push(playerId);

    values.players[playerId] = {
      ...(notes ? { notes } : {}),
      ...(lessonSpecific ? { lessonSpecific } : {}),
    };
  }

  for (const mechanic of read.mechanics) {
    const player =
      values.players[mechanic.playerId] ??
      (values.players[mechanic.playerId] = {});

    if (!player.mechanics) {
      player.mechanics = {};
    }

    player.mechanics[mechanic.mechanicId] = {
      ...(mechanic.notes ? { notes: mechanic.notes } : {}),
    };
  }

  return values;
}
