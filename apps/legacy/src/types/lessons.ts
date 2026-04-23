import {
  NewArmCare,
  NewCatchingAssessment,
  NewFieldingAssessment,
  NewForcePlate,
  NewHitTraxAssessment,
  NewHittingAssessment,
  NewPitchingAssessment,
  NewSMFA,
  NewTrueStrength,
  NewVeloAssessment,
} from "./assessments";
import {
  ArmCareSelect,
  ForcePlateSelect,
  HittingAssessmentSelect,
  LessonSelect,
  PitchingAssessmentSelect,
  PlayerSelect,
  SmfaSelect,
  TrueStrengthSelect,
  UserSelect,
} from "./database";

// Lesson types based on your schema
export const LESSON_TYPES = [
  { value: "strength", label: "Strength Training" },
  { value: "hitting", label: "Hitting" },
  { value: "pitching", label: "Pitching" },
  { value: "fielding", label: "Fielding" },
  { value: "catching", label: "Catching" },
] as const;

export const DATE_RANGE_ENUM = [
  { value: "1-2", label: "1-2 days" },
  { value: "3-4", label: "3-4 days" },
  { value: "5-6", label: "5-6 days" },
  { value: "7+", label: "7+ days" },
  { value: "na", label: "Not Applicable" },
] as const;

export type DateRange = "1-2" | "3-4" | "5-6" | "7+" | "na";

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
  lessonId: string;
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
  armCare?: NewArmCare;
  smfa?: NewSMFA;
  forcePlate?: NewForcePlate;
  trueStrength?: NewTrueStrength;
  hittingAssessment?: NewHittingAssessment;
  pitchingAssessment?: NewPitchingAssessment;
  hitTraxAssessment?: NewHitTraxAssessment;
  veloAssessment?: NewVeloAssessment;
  fieldingAssessment?: NewFieldingAssessment;
  catchingAssessment?: NewCatchingAssessment;
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
    hittingAssessment: HittingAssessmentSelect;
    pitchingAssessment: PitchingAssessmentSelect;
  };
}

export interface LessonWithCoachAndUser {
  lesson: LessonSelect;
  coach: UserSelect;
  player: PlayerSelect;
}

export interface LessonCounts {
  total: number;
  last30Days: number;
  last7Days: number;
}

export interface WeeklyChartData {
  day: string;
  lessons: number;
}
