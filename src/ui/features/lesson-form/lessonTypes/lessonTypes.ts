import {
  LessonType,
  PitchingLessonData,
  TsIsoData,
} from "@/hooks/lessons/lessonForm.types";

export type LessonTypeImplementation = {
  type: LessonType;

  label: string;

  /**
   * Renders lesson-type–specific player notes
   */
  PlayerNotes: React.ComponentType<{
    playerId: string;
    data?: TsIsoData;
  }>;

  /**
   * Returns allowed mechanic types for filtering
   */
  allowedMechanicTypes: string[];
  Review?: React.ComponentType<{
    data: PitchingLessonData;
  }>;
};
