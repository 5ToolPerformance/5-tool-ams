// src/db/schema/lessons/lessonPlayerBlocks.ts
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { lessonBlockTypes } from "./lessonBlockTypes";
import { lessonPlayers } from "./lessonPlayers";

export const lessonPlayerBlocks = pgTable(
  "lesson_player_blocks",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    lessonPlayerId: uuid("lesson_player_id")
      .notNull()
      .references(() => lessonPlayers.id, { onDelete: "cascade" }),

    blockTypeId: uuid("block_type_id")
      .notNull()
      .references(() => lessonBlockTypes.id),

    // Order within this player's lesson
    sortOrder: integer("sort_order").notNull(),

    // Optional: "Today's tee goal"
    goal: text("goal"),

    notes: text("notes"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (t) => [
    index("lesson_player_blocks_lesson_player_idx").on(t.lessonPlayerId),
    index("lesson_player_blocks_block_type_idx").on(t.blockTypeId),

    // Prevent two blocks from claiming the same slot for the same player
    uniqueIndex("lesson_player_blocks_lesson_player_sort_unique").on(
      t.lessonPlayerId,
      t.sortOrder
    ),

    // Useful for "find tee block for this player in this lesson"
    index("lesson_player_blocks_lesson_player_block_type_idx").on(
      t.lessonPlayerId,
      t.blockTypeId
    ),
  ]
);
