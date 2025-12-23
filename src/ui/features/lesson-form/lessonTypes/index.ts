import { PitchingLesson } from "./PitchingLesson";
import { LessonTypeImplementation } from "./lessonTypes";

export const LESSON_TYPE_REGISTRY: Record<string, LessonTypeImplementation> = {
  pitching: PitchingLesson,
  // Add other lesson types i.e. hitting: HittingLesson
};
