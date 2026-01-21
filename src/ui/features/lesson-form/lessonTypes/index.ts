import { CatchingLesson } from "@/ui/features/lesson-form/lessonTypes/CatchingLesson";
import { FieldingLesson } from "@/ui/features/lesson-form/lessonTypes/FieldingLesson";
import { HittingLesson } from "@/ui/features/lesson-form/lessonTypes/HittingLesson";
import { StrengthLesson } from "@/ui/features/lesson-form/lessonTypes/StrengthLesson";

import { PitchingLesson } from "./PitchingLesson";
import { LessonTypeImplementation } from "./lessonTypes";

export const LESSON_TYPE_REGISTRY: Record<string, LessonTypeImplementation> = {
  pitching: PitchingLesson,
  strength: StrengthLesson,
  hitting: HittingLesson,
  fielding: FieldingLesson,
  catching: CatchingLesson,
  // Add other lesson types i.e. hitting: HittingLesson
};
