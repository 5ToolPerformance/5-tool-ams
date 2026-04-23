// src/db/schema/lessons/lessonBlockTypes.ts
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { disciplines } from "@/db/schema/config/disciplines";

export const lessonBlockTypes = pgTable(
  "lesson_block_types",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    disciplineId: uuid("discipline_id")
      .notNull()
      .references(() => disciplines.id, { onDelete: "cascade" }),

    key: text("key").notNull(), // "warmup", "tee_work", "underhand", "machine"
    label: text("label").notNull(), // "Warm-up", "Tee Work"

    description: text("description"),

    active: boolean("active").notNull().default(true),

    defaultSortOrder: integer("default_sort_order"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("lesson_block_types_discipline_key_unique").on(
      t.disciplineId,
      t.key
    ),
    index("lesson_block_types_discipline_idx").on(t.disciplineId),
    index("lesson_block_types_active_idx").on(t.active),
  ]
);
