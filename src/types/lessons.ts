import {
  ArmCare,
  CatchingAssessment,
  ForcePlate,
  HittingAssessment,
  PitchingAssessment,
  SMFA,
  TrueStrength,
} from "./assessments";
import {
  ArmCareSelect,
  ForcePlateSelect,
  LessonSelect,
  SmfaSelect,
  TrueStrengthSelect,
} from "./database";

// Lesson types based on your schema
export const LESSON_TYPES = [
  { value: "strength", label: "Strength Training" },
  { value: "hitting", label: "Hitting Practice" },
  { value: "pitching", label: "Pitching Training" },
  { value: "fielding", label: "Catching Practice" },
] as const;

export type LessonType =
  | "strength"
  | "hitting"
  | "pitching"
  | "fielding"
  | "catching";

/**
 * Base Data for a Lesson
 */
export interface BaseLessonData {
  playerId: string; // Player ID
  coachId: string;
  type: LessonType;
  lessonDate: string;
  notes: string;
}

/**
 * Lesson Form Data with Assessments
 */
export interface LessonCreateData extends BaseLessonData {
  armCare?: ArmCare;
  smfa?: SMFA;
  forcePlate?: ForcePlate;
  trueStrength?: TrueStrength;
  hittingAssessment?: HittingAssessment;
  pitchingAssessment?: PitchingAssessment;
  catchingAssessment?: CatchingAssessment;
}

/**
 * Lesson Request Interface
 */
export interface LessonWithAssessment {
  lesson: LessonSelect;
  assessments: {
    armCare: ArmCareSelect;
    smfa: SmfaSelect;
    forcePlate: ForcePlateSelect;
    trueStrength: TrueStrengthSelect;
  };
}
