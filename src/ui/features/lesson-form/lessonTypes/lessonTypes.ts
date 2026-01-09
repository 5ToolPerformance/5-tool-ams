import {
  LessonType,
  PitchingLessonData,
} from "@/hooks/lessons/lessonForm.types";

export type LessonTypeImplementation = {
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
    data: PitchingLessonData;
  }>;
};
