import { LessonType, TsIsoData } from "@/hooks/lessons/lessonForm.types";

export type LessonTypeImplementation<TLessonSpecific> = {
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
    data: TLessonSpecific;
  }>;
};
