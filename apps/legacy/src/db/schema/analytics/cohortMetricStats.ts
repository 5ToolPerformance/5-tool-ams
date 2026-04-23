// db/schema/cohortMetricStats.ts
import {
    pgTable,
    real,
    timestamp,
    uuid
} from "drizzle-orm/pg-core";
import { cohortDefinitions } from "./cohortDefinitions";
import { metricDefinitions } from "./metricDefinitions";

export const cohortMetricStats = pgTable("cohort_metric_stats", {
  cohortId: uuid("cohort_id")
    .references(() => cohortDefinitions.id, { onDelete: "cascade" })
    .notNull(),

  metricId: uuid("metric_id")
    .references(() => metricDefinitions.id)
    .notNull(),

  p10: real("p10"),
  p25: real("p25"),
  p50: real("p50"),
  p75: real("p75"),
  p90: real("p90"),

  mean: real("mean"),
  stddev: real("stddev"),

  calculatedAt: timestamp("calculated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
