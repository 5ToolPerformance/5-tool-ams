// src/db/schema/development/buckets.ts
import {
  boolean,
  integer,
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

    description: text("description"),

    active: boolean("active").notNull().default(true),

    sortOrder: integer("sort_order"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("buckets_discipline_key_unique").on(t.disciplineId, t.key),
  ]
);
