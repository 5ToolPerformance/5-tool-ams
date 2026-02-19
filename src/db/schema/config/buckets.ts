// src/db/schema/development/buckets.ts
import {
  boolean,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { disciplines } from "./disciplines";

export const buckets = pgTable(
  "buckets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    disciplineId: uuid("discipline_id")
      .notNull()
      .references(() => disciplines.id, { onDelete: "cascade" }),
    key: text("key").notNull(), // "swing_mechanics"
    label: text("label").notNull(), // "Swing Mechanics"
    active: boolean("active").notNull().default(true),
    sortOrder: text("sort_order"), // optional; or integer if you prefer
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("buckets_discipline_key_unique").on(t.disciplineId, t.key),
  ]
);
