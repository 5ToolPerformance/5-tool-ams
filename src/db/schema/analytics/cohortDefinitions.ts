// db/schema/cohortDefinitions.ts
import {
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

export const cohortDefinitions = pgTable("cohort_definitions", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(), // "U16 Pitchers"
  description: text("description"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
