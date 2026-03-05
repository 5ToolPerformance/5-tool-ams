// src/db/schema/routines/routines.ts
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { disciplines, users } from "@/db/schema";
import playerInformation from "@/db/schema/players/playerInformation";

export const routineContextEnum = pgEnum("routine_context", [
  "block",
  "full_lesson",
]);

export const routineVisibilityEnum = pgEnum("routine_visibility", [
  "library", // reusable across players
  "player", // player-specific
]);

export const routines = pgTable(
  "routines",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    disciplineId: uuid("discipline_id")
      .notNull()
      .references(() => disciplines.id, { onDelete: "cascade" }),

    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id),

    // If visibility = player, this should be set
    playerId: uuid("player_id").references(() => playerInformation.id, {
      onDelete: "cascade",
    }),

    visibility: routineVisibilityEnum("visibility")
      .notNull()
      .default("library"),

    context: routineContextEnum("context").notNull(),

    title: text("title").notNull(),
    description: text("description"),

    active: boolean("active").notNull().default(true),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (t) => [
    index("routines_discipline_idx").on(t.disciplineId),
    index("routines_player_idx").on(t.playerId),
    index("routines_created_by_idx").on(t.createdBy),
  ]
);
