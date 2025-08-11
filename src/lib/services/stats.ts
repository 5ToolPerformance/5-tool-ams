const dummyData = {
  force_plate: {
    cmj: 18.66,
    drop_jump: 1.69,
    pogo: 1.94,
    mtp: 4356,
    mtp_time: 2.29,
  },
  true_strength: {
    shoulder_er_l: 93.95,
    shoulder_er_r: 157.46,
    shoulder_ir_l: 189.59,
    shoulder_ir_r: 202.18,
    shoulder_rotation_l: 1277.66,
    shoulder_rotation_r: 857.94,
    shoulder_rotation_rfd_l: 23365,
    shoulder_rotation_rfd_r: 16700,
    hip_rotation_l: 1287.21,
    hip_rotation_r: 1195.36,
    hip_rotation_rfd_l: 15350,
    hip_rotation_rfd_r: 13144,
  },
};

export class StatsService {
  static calculatePowerRating() {
    const { force_plate, true_strength } = dummyData;

    const vpow =
      force_plate.cmj * 0.25 +
      force_plate.drop_jump * 0.25 +
      force_plate.pogo * 0.25 +
      (force_plate.mtp / force_plate.mtp_time) * 0.25;
    const trot_r =
      true_strength.shoulder_rotation_r * 0.5 +
      true_strength.hip_rotation_r * 0.5 +
      true_strength.shoulder_rotation_rfd_r * 0.5 +
      true_strength.hip_rotation_rfd_r * 0.5;
    const trot_l =
      true_strength.shoulder_rotation_l * 0.5 +
      true_strength.hip_rotation_l * 0.5 +
      true_strength.shoulder_rotation_rfd_l * 0.5 +
      true_strength.hip_rotation_rfd_l * 0.5;

    const arm_str_r =
      true_strength.shoulder_er_r * 0.5 + true_strength.shoulder_ir_r * 0.5;
    const arm_str_l =
      true_strength.shoulder_er_l * 0.5 + true_strength.shoulder_ir_l * 0.5;

    const nvpow = (vpow - 0.1) / (2000 / 0.1);
    const ntrot_r = (trot_r - 0.1) / (40000 - 0.1);
    const ntrot_l = (trot_l - 0.1) / (40000 - 0.1);
    const narstr_r = (arm_str_r - 0.1) / (300 - 0.1);
    const narstr_l = (arm_str_l - 0.1) / (300 - 0.1);

    const power_rating_l = (nvpow * 0.3 + ntrot_l * 0.4 + narstr_l * 0.3) * 100;
    const power_rating_r = (nvpow * 0.3 + ntrot_r * 0.4 + narstr_r * 0.3) * 100;

    return {
      trot_l,
      trot_r,
      arm_str_l,
      arm_str_r,
      vpow,
      nvpow,
      ntrot_l,
      ntrot_r,
      narstr_l,
      narstr_r,
      power_rating_l,
      power_rating_r,
    };
  }
}
