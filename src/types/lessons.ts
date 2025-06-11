// Lesson types based on your schema
export const LESSON_TYPES = [
  { value: "strength", label: "Strength Training" },
  { value: "hitting", label: "Hitting Practice" },
  { value: "pitching", label: "Pitching Training" },
  { value: "fielding", label: "Fielding Practice" },
] as const;

export type LessonType = "strength" | "hitting" | "pitching" | "fielding";

// Form data interface
export interface LessonFormData {
  userId: string; // Player ID
  coachId: string;
  type: LessonType;
  lessonDate: Date;
  notes: string;
}

// API request interface
export interface CreateLessonRequest {
  userId: string;
  coachId: string;
  type: LessonType;
  lessonDate: string; // ISO string
  notes?: string;
}

// Database entities based on your schema
export interface User {
  id: string;
  // Add other user fields as needed
  name?: string;
  email?: string;
  createdAt?: Date;
}

export interface Lesson {
  id: string;
  userId: string;
  coachId: string;
  type: LessonType;
  armCare?: string | null;
  smfa?: string | null;
  hawkinsForce?: string | null;
  trueStrength?: string | null;
  notes?: string | null;
  createdOn: Date;
  lessonDate: Date;
}

export type NewLesson = Omit<Lesson, "id" | "createdOn">;

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LessonWithRelations extends Lesson {
  user?: User;
  coach?: User;
}

export interface LessonCreateData {
  coachId: string;
  playerId: string;
  lessonType: LessonType;
  lessonDate: string;
  notes: string;
  strengthAssessment?: {
    maxSquat?: string;
    maxBench?: string;
    maxDeadlift?: string;
    bodyWeight?: string;
    notes?: string;
  };
  forcePlateAssessment?: {
    jumpHeight?: string;
    groundReactionForce?: string;
    contactTime?: string;
    peakPower?: string;
    rateOfForceDevelopment?: string;
    notes?: string;
  };
  hittingAssessment?: {
    exitVelocity?: string;
    launchAngle?: string;
    spinRate?: string;
    distance?: string;
    strikeZoneContact?: string;
    hardHitRate?: string;
    notes?: string;
  };
  armCareAssessment?: {
    shoulder_er_l?: string;
    shoulder_er_r?: string;
    shoulder_ir_l?: string;
    shoulder_ir_r?: string;
    shoulder_flexion_l?: string;
    shoulder_flexion_r?: string;
    supine_hip_er_l?: string;
    supine_hip_er_r?: string;
    supine_hip_ir_l?: string;
    supine_hip_ir_r?: string;
    straight_leg_l?: string;
    straight_leg_r?: string;
    notes?: string;
  };
}
