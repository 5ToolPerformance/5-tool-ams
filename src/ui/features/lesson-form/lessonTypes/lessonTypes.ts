import type { PitchingLessonData } from "@/hooks/lessons/lessonForm.types";
import { LessonType } from "@/hooks/lessons/lessonForm.types";

export type LessonTypeImplementation<TLessonSpecific> = {
  type: LessonType;

  label: string;

  /**
   * Renders lesson-type–specific player notes
   */
  PlayerNotes: React.ComponentType<{
    playerId: string;
  }>;

  /**
   * Returns allowed mechanic types for filtering
   */
  allowedMechanicTypes: string[];
  Review?: React.ComponentType<{
    data: TLessonSpecific;
  }>;
  allowedDrillTypes: string[];
  fatigueCheck: boolean;
};

export type LessonSpecificByType = {
  pitching: PitchingLessonData;
  strength: never;
  hitting: never;
  fielding: never;
  catching: never;
};
