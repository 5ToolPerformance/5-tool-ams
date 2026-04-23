// db/schema/metricSources.ts
import { pgTable, real, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { metricDefinitions } from "./metricDefinitions";

export const metricSources = pgTable("metric_sources", {
  id: uuid("id").defaultRandom().primaryKey(),

  metricId: uuid("metric_id")
    .references(() => metricDefinitions.id, { onDelete: "cascade" })
    .notNull(),

  system: text("system").notNull(), // hawkin | armcare | trackman
  sourceTable: text("source_table").notNull(), // hawkins_cmj
  sourceField: text("source_field").notNull(), // jump_height

  reliability: real("reliability"), // 0–1 confidence weighting (optional)

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
