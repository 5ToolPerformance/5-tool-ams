import { numeric, pgTable } from "drizzle-orm/pg-core";

import {
  createEvaluationMetricBaseColumns,
  createEvaluationMetricBaseIndexes,
} from "@/db/schema/evaluations/evidence/evaluationMetrics.utils";

export const evaluationHittrax = pgTable(
  "evaluation_hittrax",
  {
    ...createEvaluationMetricBaseColumns(),

    // Example manual metrics
    exitVelocityMax: numeric("exit_velocity_max"),
    exitVelocityAvg: numeric("exit_velocity_avg"),
    hardHitPercent: numeric("hard_hit_percent"),
    launchAngleAvg: numeric("launch_angle_avg"),
    lineDriveAvg: numeric("line_drive_avg"),
  },
  (table) => [...createEvaluationMetricBaseIndexes(table, "evaluation_hittrax")]
);
