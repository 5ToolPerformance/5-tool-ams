export interface ArmCare {
  id: string;
  playerId: string;
  coachId: string;
  lessonId: string;
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
  lessonDate: Date;
  createdOn: Date;
}

export interface SMFA {
  id: string;
  playerId: string;
  coachId: string;
  lessonId: string;
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
  lessonDate: Date;
  createdOn: Date;
}

export interface ForcePlate {
  id: string;
  playerId: string;
  coachId: string;
  lessonId: string;
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
  lessonDate: Date;
  createdOn: Date;
}

export interface TrueStrength {
  id: string;
  playerId: string;
  coachId: string;
  lessonId: string;
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
  lessonDate: Date;
  createdOn: Date;
}

export interface HittingAssessment {
  id: string;
  playerId: string;
  coachId: string;
  lessonId: string;
  coachNotes?: string;
  playerNotes?: string;
  head?: string;
  load?: string;
  upper?: string;
  lower?: string;
  exit_velo_avg?: number;
  spin_axis?: number;
  max_distance?: number;
  linedrive_pct?: number;
  lessonDate: Date;
  createdOn: Date;
}

export interface GeneralAssessment {
  id: string;
  playerId: string;
  coachId: string;
  lessonId: string;
  coachNotes?: string;
  playerNotes?: string;
  lessonDate: Date;
  createdOn: Date;
}

export interface PitchingAssessment extends GeneralAssessment {
  core?: string;
  stride?: string;
}

export interface CatchingAssessment extends GeneralAssessment {
  arm?: string;
}

export type AssessmentType =
  | "arm_care"
  | "smfa"
  | "force_plate"
  | "true_strength";

export type Archetype = "aerial" | "terrestrial";
export type leftRight = "left" | "right" | "switch";

export type NewArmCare = Omit<ArmCare, "id" | "createdOn">;
export type NewSMFA = Omit<SMFA, "id" | "createdOn">;
export type NewForcePlate = Omit<ForcePlate, "id" | "createOn">;
export type NewTrueStrength = Omit<TrueStrength, "id" | "createdOn">;

export interface MotorPreferencesForm {
  playerId: string;
  coachId: string;
  archetype: Archetype;
  breath: boolean;
  extensionLeg: leftRight;
  association: boolean;
  assessmentDate: string;
}
