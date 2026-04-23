// src/db/schema/lessons/lessonPlayerBlockItems.ts
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { drills, mechanics } from "@/db/schema";

import { lessonPlayerBlocks } from "./lessonPlayerBlocks";

export const lessonPlayerBlockItemTypeEnum = pgEnum(
  "lesson_player_block_item_type",
  ["drill", "mechanic", "cue", "constraint", "measurement", "media"]
);

export const lessonPlayerBlockItems = pgTable(
  "lesson_player_block_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    lessonPlayerBlockId: uuid("lesson_player_block_id")
      .notNull()
      .references(() => lessonPlayerBlocks.id, { onDelete: "cascade" }),

    itemType: lessonPlayerBlockItemTypeEnum("item_type").notNull(),

    // Order within the block
    sortOrder: integer("sort_order").notNull(),

    // Typed refs (enforced by app logic based on itemType)
    drillId: uuid("drill_id").references(() => drills.id, {
      onDelete: "set null",
    }),

    mechanicId: uuid("mechanic_id").references(() => mechanics.id, {
      onDelete: "set null",
    }),

    // For cue/constraint/measurement instructions, etc.
    text: text("text"),

    // Dosage options (common for drills + measurements)
    sets: integer("sets"),
    reps: integer("reps"),
    seconds: integer("seconds"),

    intensity: text("intensity"),

    // Escape hatch
    params: jsonb("params"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("lesson_player_block_items_block_idx").on(t.lessonPlayerBlockId),
    index("lesson_player_block_items_block_sort_idx").on(
      t.lessonPlayerBlockId,
      t.sortOrder
    ),
    index("lesson_player_block_items_type_idx").on(t.itemType),
    index("lesson_player_block_items_drill_idx").on(t.drillId),
    index("lesson_player_block_items_mechanic_idx").on(t.mechanicId),
  ]
);
