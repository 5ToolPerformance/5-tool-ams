// db/schema/athleteMetricSnapshots.ts
import {
    date,
    pgTable,
    real,
    text,
    timestamp,
    uuid
} from "drizzle-orm/pg-core";
import playerInformation from "../players/playerInformation";
import { metricDefinitions } from "./metricDefinitions";

export const athleteMetricSnapshots = pgTable("athlete_metric_snapshots", {
  id: uuid("id").defaultRandom().primaryKey(),

  athleteId: uuid("athlete_id")
    .references(() => playerInformation.id, { onDelete: "cascade" })
    .notNull(),

  metricId: uuid("metric_id")
    .references(() => metricDefinitions.id)
    .notNull(),

  rawValue: real("raw_value").notNull(),
  normalizedValue: real("normalized_value"), // z-score or 0–100

  recordedAt: date("recorded_at").notNull(),
  sourceTable: text("source_table"), // hawkins_cmj, ts_iso, etc

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
