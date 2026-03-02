import type {
  PitchingLessonData,
  StrengthLessonSpecific,
} from "@/hooks/lessons/lessonForm.types";
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
  allowedDrillTypes: string[];
  fatigueCheck: boolean;
};

export type LessonSpecificByType = {
  pitching: PitchingLessonData;
  strength: StrengthLessonSpecific;
  hitting: never;
  fielding: never;
  catching: never;
};
