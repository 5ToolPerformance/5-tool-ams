import type {
  CatchingAssessmentInsert,
  FieldingAssessmentInsert,
  HitTraxAssessmentInsert,
  HittingAssessmentInsert,
  PitchingAssessmentInsert,
  VeloAssessmentInsert,
} from "./database";

export type NewArmCare = {
  notes?: string;
  shoulder_er_l?: number;
  shoulder_er_r?: number;
  shoulder_ir_l?: number;
  shoulder_ir_r?: number;
  shoulder_flexion_l?: number;
  shoulder_flexion_r?: number;
  supine_hip_er_l?: number;
  supine_hip_er_r?: number;
  supine_hip_ir_l?: number;
  supine_hip_ir_r?: number;
  straight_leg_l?: number;
  straight_leg_r?: number;
};

export type NewSMFA = {
  notes?: string;
  pelvic_rotation_l?: boolean;
  pelvic_rotation_r?: boolean;
  seated_trunk_rotation_l?: boolean;
  seated_trunk_rotation_r?: boolean;
  ankle_test_l?: boolean;
  ankle_test_r?: boolean;
  forearm_test_l?: boolean;
  forearm_test_r?: boolean;
  cervical_rotation_l?: boolean;
  cervical_rotation_r?: boolean;
  msf_l?: boolean;
  msf_r?: boolean;
  mse_l?: boolean;
  mse_r?: boolean;
  msr_l?: boolean;
  msr_r?: boolean;
  pelvic_tilt?: boolean;
  squat_test?: boolean;
  cervical_flexion?: boolean;
  cervical_extension?: boolean;
};

export type NewForcePlate = {
  notes?: string;
  cmj?: number;
  drop_jump?: number;
  pogo?: number;
  mid_thigh_pull?: number;
  mtp_time?: number;
  cop_ml_l?: number;
  cop_ml_r?: number;
  cop_ap_l?: number;
  cop_ap_r?: number;
};

export type NewTrueStrength = {
  notes?: string;
  seated_shoulder_er_l?: number;
  seated_shoulder_er_r?: number;
  seated_shoulder_ir_l?: number;
  seated_shoulder_ir_r?: number;
  shoulder_rotation_l?: number;
  shoulder_rotation_r?: number;
  shoulder_rotation_rfd_l?: number;
  shoulder_rotation_rfd_r?: number;
  hip_rotation_l?: number;
  hip_rotation_r?: number;
  hip_rotation_rfd_l?: number;
  hip_rotation_rfd_r?: number;
};

export type NewHittingAssessment = Omit<
  HittingAssessmentInsert,
  "coachId" | "playerId" | "lessonId"
>;

export type NewPitchingAssessment = Omit<
  PitchingAssessmentInsert,
  "coachId" | "playerId" | "lessonId"
>;

export type NewHitTraxAssessment = Omit<
  HitTraxAssessmentInsert,
  "coachId" | "playerId" | "lessonId"
>;

export type NewVeloAssessment = Omit<
  VeloAssessmentInsert,
  "coachId" | "playerId" | "lessonId"
>;

export type NewFieldingAssessment = Omit<
  FieldingAssessmentInsert,
  "coachId" | "playerId" | "lessonId"
>;

export type NewCatchingAssessment = Omit<
  CatchingAssessmentInsert,
  "coachId" | "playerId" | "lessonId"
>;
