import type { RoutineDocumentV1 } from "@/domain/routines/types";

import type { LessonRoutineSource, LessonRoutineType, LessonType } from "./lessonForm.types";

export type LessonRoutineOption = {
  key: string;
  source: LessonRoutineSource;
  routineId: string;
  routineType: LessonRoutineType;
  title: string;
  playerId: string | null;
  disciplineId: string;
  disciplineKey: LessonType;
  document: RoutineDocumentV1;
};
