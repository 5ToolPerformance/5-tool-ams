// db/schema/metricDefinitions.ts
import {
    boolean,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

export const metricDefinitions = pgTable("metric_definitions", {
  id: uuid("id").defaultRandom().primaryKey(),

  system: text("system").notNull(), // hawkin | armcare | internal
  metricKey: text("metric_key").notNull(), // cmj_height, peak_force
  displayName: text("display_name").notNull(),
  unit: text("unit"), // cm, N, W/kg

  higherIsBetter: boolean("higher_is_better").default(true).notNull(),
  category: text("category"), // power | strength | asymmetry

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
