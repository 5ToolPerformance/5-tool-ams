import { LessonCreateData } from "@/types/lessons";

export const getCompleteLessonDefaults = (
  coachId: string
): LessonCreateData => ({
  lessonId: "",
  coachId,
  playerId: "",
  type: "strength",
  lessonDate: new Date().toISOString().split("T")[0],
  notes: "",

  // ArmCare defaults
  armCare: {
    shoulder_er_l: undefined,
    shoulder_er_r: undefined,
    shoulder_ir_l: undefined,
    shoulder_ir_r: undefined,
    shoulder_flexion_l: undefined,
    shoulder_flexion_r: undefined,
    supine_hip_er_l: undefined,
    supine_hip_er_r: undefined,
    supine_hip_ir_l: undefined,
    supine_hip_ir_r: undefined,
    straight_leg_l: undefined,
    straight_leg_r: undefined,
    notes: "",
  },

  // SMFA defaults
  smfa: {
    pelvic_rotation_l: false,
    pelvic_rotation_r: false,
    seated_trunk_rotation_l: false,
    seated_trunk_rotation_r: false,
    ankle_test_l: false,
    ankle_test_r: false,
    forearm_test_l: false,
    forearm_test_r: false,
    cervical_rotation_l: false,
    cervical_rotation_r: false,
    msf_l: false,
    msf_r: false,
    mse_l: false,
    mse_r: false,
    msr_l: false,
    msr_r: false,
    pelvic_tilt: false,
    squat_test: false,
    cervical_flexion: false,
    cervical_extension: false,
    notes: "",
  },

  // Force Plate defaults
  forcePlate: {
    cmj: undefined,
    drop_jump: undefined,
    pogo: undefined,
    mid_thigh_pull: undefined,
    mtp_time: undefined,
    cop_ml_l: undefined,
    cop_ml_r: undefined,
    cop_ap_l: undefined,
    cop_ap_r: undefined,
    notes: "",
  },

  // True Strength defaults
  trueStrength: {
    seated_shoulder_er_l: undefined,
    seated_shoulder_er_r: undefined,
    seated_shoulder_ir_l: undefined,
    seated_shoulder_ir_r: undefined,
    shoulder_rotation_l: undefined,
    shoulder_rotation_r: undefined,
    shoulder_rotation_rfd_l: undefined,
    shoulder_rotation_rfd_r: undefined,
    hip_rotation_l: undefined,
    hip_rotation_r: undefined,
    hip_rotation_rfd_l: undefined,
    hip_rotation_rfd_r: undefined,
    notes: "",
  },

  // Hitting Assessment defaults
  hittingAssessment: {
    upper: "",
    lower: "",
    head: "",
    load: "",
    max_ev: undefined,
    line_drive_pct: undefined,
  },

  // Pitching Assessment defaults
  pitchingAssessment: {
    upper: "",
    mid: "",
    lower: "",
    velo_mound_2oz: undefined,
    velo_mound_4oz: undefined,
    velo_mound_5oz: undefined,
    velo_mound_6oz: undefined,
    velo_pull_down_2oz: undefined,
    velo_pull_down_4oz: undefined,
    velo_pull_down_5oz: undefined,
    velo_pull_down_6oz: undefined,
    strike_pct: undefined,
    notes: "",
    goals: "",
    last_time_pitched: undefined,
    next_time_pitched: undefined,
    feel: undefined,
    concerns: "",
  },

  // HitTrax Assessment defaults
  hitTraxAssessment: {
    pitchType: "",
    avgExitVelo: undefined,
    avgHardHit: undefined,
    maxVelo: undefined,
    maxDist: undefined,
    fbAndGbPct: undefined,
    lineDrivePct: undefined,
  },

  // Velo Assessment defaults
  veloAssessment: {
    intent: undefined,
    avgVelo: undefined,
    topVelo: undefined,
    strikePct: undefined,
  },
});
