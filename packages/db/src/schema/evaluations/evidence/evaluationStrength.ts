import { numeric, pgTable } from "drizzle-orm/pg-core";

import {
  createEvaluationMetricBaseColumns,
  createEvaluationMetricBaseIndexes,
} from "@/db/schema/evaluations/evidence/evaluationMetrics.utils";

export const evaluationsStrength = pgTable(
  "evaluation_strength",
  {
    ...createEvaluationMetricBaseColumns(),

    // Metrics
    powerRating: numeric("power_rating"),
    rotation: numeric("rotation"),
    lowerBodyStrength: numeric("lower_body_strength"),
    upperBodyStrength: numeric("upper_body_strength"),

    // Raw Metrics
    plyoPushup: numeric("plyo_pushup"),
    seatedShoulderErL: numeric("seated_shoulder_er_l"),
    seatedShoulderErR: numeric("seated_shoulder_er_r"),
    seatedShoulderIrL: numeric("seated_shoulder_ir_l"),
    seatedShoulderIrR: numeric("seated_shoulder_ir_r"),
    cmj: numeric("cmj"),
    cmjPropulsiveImpulse: numeric("cmj_propulsive_impulse"),
    cmjPeakPower: numeric("cmj_peak_power"),
    pogoJump: numeric("pogo_jump"),
    dropJump: numeric("drop_jump"),
    midThighPull: numeric("mid_thigh_pull"),
    midThighPullTtpf: numeric("mid_thigh_pull_ttpf"),
    netForce100ms: numeric("net_force_100ms"),
    shotPut: numeric("shot_put"),
    scoopToss: numeric("scoop_toss"),
  },
  (table) => [
    ...createEvaluationMetricBaseIndexes(table, "evaluation_strength"),
  ]
);
