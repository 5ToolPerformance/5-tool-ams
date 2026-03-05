// src/db/schema/routines/routineBlockItems.ts
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

import { routineBlocks } from "./routineBlocks";

export const routineBlockItemTypeEnum = pgEnum("routine_block_item_type", [
  "drill",
  "mechanic",
  "cue",
  "constraint",
  "measurement",
  "media",
]);

export const routineBlockItems = pgTable(
  "routine_block_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    routineBlockId: uuid("routine_block_id")
      .notNull()
      .references(() => routineBlocks.id, { onDelete: "cascade" }),

    itemType: routineBlockItemTypeEnum("item_type").notNull(),

    sortOrder: integer("sort_order").notNull(),

    drillId: uuid("drill_id").references(() => drills.id, {
      onDelete: "set null",
    }),

    mechanicId: uuid("mechanic_id").references(() => mechanics.id, {
      onDelete: "set null",
    }),

    text: text("text"),

    sets: integer("sets"),
    reps: integer("reps"),
    seconds: integer("seconds"),
    intensity: text("intensity"),

    params: jsonb("params"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("routine_block_items_block_idx").on(t.routineBlockId),
    index("routine_block_items_block_sort_idx").on(
      t.routineBlockId,
      t.sortOrder
    ),
    index("routine_block_items_type_idx").on(t.itemType),
  ]
);
