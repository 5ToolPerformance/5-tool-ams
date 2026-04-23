import { numeric, pgTable } from "drizzle-orm/pg-core";

import {
  createEvaluationMetricBaseColumns,
  createEvaluationMetricBaseIndexes,
} from "@/db/schema/evaluations/evidence/evaluationMetrics.utils";

export const evaluationBlast = pgTable(
  "evaluation_blast",
  {
    ...createEvaluationMetricBaseColumns(),

    batSpeedMax: numeric("bat_speed_max"),
    batSpeedAvg: numeric("bat_speed_avg"),
    rotAccMax: numeric("rot_acc_max"),
    rotAccAvg: numeric("rot_acc_avg"),
    onPlanePercent: numeric("on_plane_percent"),
    attackAngleAvg: numeric("attack_angle"),
    earlyConnAvg: numeric("early_connection_avg"),
    connAtImpactAvg: numeric("connection_at_impact_avg"),
    verticalBatAngleAvg: numeric("vertical_bat_angle_avg"),
    timeToContactAvg: numeric("time_to_contact_avg"),
    handSpeedMax: numeric("hand_speed_max"),
    handSpeedAvg: numeric("hand_speed_avg"),
    powerAvg: numeric("power_avg"),
  },
  (table) => [...createEvaluationMetricBaseIndexes(table, "evaluation_blast")]
);
