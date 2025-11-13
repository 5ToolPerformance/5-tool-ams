import { ForcePlateSelect, TrueStrengthSelect } from "@/types/database";

export class StatsService {
  static calculatePowerRating(
    forcePlateData: ForcePlateSelect,
    trueStrengthData: TrueStrengthSelect
  ) {
    const vpow =
      forcePlateData.cmj * 0.25 +
      forcePlateData.drop_jump * 0.25 +
      forcePlateData.pogo * 0.25 +
      (forcePlateData.mid_thigh_pull / forcePlateData.mtp_time) * 0.25;
    const trot_r =
      trueStrengthData.shoulder_rotation_r * 0.5 +
      trueStrengthData.hip_rotation_r * 0.5 +
      trueStrengthData.shoulder_rotation_rfd_r * 0.5 +
      trueStrengthData.hip_rotation_rfd_r * 0.5;
    const trot_l =
      trueStrengthData.shoulder_rotation_l * 0.5 +
      trueStrengthData.hip_rotation_l * 0.5 +
      trueStrengthData.shoulder_rotation_rfd_l * 0.5 +
      trueStrengthData.hip_rotation_rfd_l * 0.5;

    const arm_str_r =
      trueStrengthData.seated_shoulder_er_r * 0.5 +
      trueStrengthData.seated_shoulder_ir_r * 0.5;
    const arm_str_l =
      trueStrengthData.seated_shoulder_er_l * 0.5 +
      trueStrengthData.seated_shoulder_ir_l * 0.5;

    const nvpow = (vpow - 0.1) / (2000 / 0.1);
    const ntrot_r = (trot_r - 0.1) / (40000 - 0.1);
    const ntrot_l = (trot_l - 0.1) / (40000 - 0.1);
    const narstr_r = (arm_str_r - 0.1) / (300 - 0.1);
    const narstr_l = (arm_str_l - 0.1) / (300 - 0.1);

    const power_rating_l = (nvpow * 0.3 + ntrot_l * 0.4 + narstr_l * 0.3) * 100;
    const power_rating_r = (nvpow * 0.3 + ntrot_r * 0.4 + narstr_r * 0.3) * 100;

    return {
      power_rating_l,
      power_rating_r,
    };
  }
}
