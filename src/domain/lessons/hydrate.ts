import { LessonFormValues } from "@/hooks/lessons/lessonForm.types";

import type { LessonReadModel } from "./types";

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
    const { playerId, lessonPlayerId, notes, lessonSpecific } = participant;

    values.selectedPlayerIds.push(playerId);

    values.players[playerId] = {
      ...(lessonPlayerId ? { lessonPlayerId } : {}),
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
