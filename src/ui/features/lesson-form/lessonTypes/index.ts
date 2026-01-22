import { LessonType } from "@/hooks/lessons/lessonForm.types";
import { CatchingLesson } from "@/ui/features/lesson-form/lessonTypes/CatchingLesson";
import { FieldingLesson } from "@/ui/features/lesson-form/lessonTypes/FieldingLesson";
import { HittingLesson } from "@/ui/features/lesson-form/lessonTypes/HittingLesson";
import { StrengthLesson } from "@/ui/features/lesson-form/lessonTypes/StrengthLesson";

import { PitchingLesson } from "./PitchingLesson";
import { LessonSpecificByType, LessonTypeImplementation } from "./lessonTypes";

export const LESSON_TYPE_REGISTRY: LessonTypeRegistry = {
  pitching: PitchingLesson,
  strength: StrengthLesson,
  hitting: HittingLesson,
  fielding: FieldingLesson,
  catching: CatchingLesson,
  // Add other lesson types i.e. hitting: HittingLesson
};

export type LessonTypeRegistry = {
  [K in LessonType]: LessonTypeImplementation<LessonSpecificByType[K]>;
};
