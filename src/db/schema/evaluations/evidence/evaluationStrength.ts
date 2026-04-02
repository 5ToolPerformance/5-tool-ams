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
  },
  (table) => [
    ...createEvaluationMetricBaseIndexes(table, "evaluation_strength"),
  ]
);
