// db/schema/metricWeights.ts
import {
    pgTable,
    real,
    text,
    uuid
} from "drizzle-orm/pg-core";
import { metricDefinitions } from "./metricDefinitions";

export const metricWeights = pgTable("metric_weights", {
  metricId: uuid("metric_id")
    .references(() => metricDefinitions.id)
    .notNull(),

  scoreType: text("score_type").notNull(), // power_rating
  weight: real("weight").notNull(),
});
