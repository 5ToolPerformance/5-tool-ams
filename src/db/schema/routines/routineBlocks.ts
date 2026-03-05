// src/db/schema/routines/routineBlocks.ts
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { lessonBlockTypes } from "@/db/schema";

import { routines } from "./routines";

export const routineBlocks = pgTable(
  "routine_blocks",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    routineId: uuid("routine_id")
      .notNull()
      .references(() => routines.id, { onDelete: "cascade" }),

    blockTypeId: uuid("block_type_id")
      .notNull()
      .references(() => lessonBlockTypes.id),

    sortOrder: integer("sort_order").notNull(),

    goal: text("goal"),
    notes: text("notes"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("routine_blocks_routine_idx").on(t.routineId),
    index("routine_blocks_block_type_idx").on(t.blockTypeId),
    uniqueIndex("routine_blocks_routine_sort_unique").on(
      t.routineId,
      t.sortOrder
    ),
  ]
);
