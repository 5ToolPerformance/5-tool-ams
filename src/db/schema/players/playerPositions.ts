import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { playerInformation, positions } from "@/db/schema";

export const playerPositions = pgTable("player_positions", {
  id: uuid("id").primaryKey().defaultRandom(),

  playerId: uuid("player_id")
    .notNull()
    .references(() => playerInformation.id, { onDelete: "cascade" }),

  positionId: uuid("position_id")
    .notNull()
    .references(() => positions.id, { onDelete: "cascade" }),

  isPrimary: boolean("is_primary").notNull().default(false),
  notes: text("notes"), // optional (e.g. “limited innings”)
});
