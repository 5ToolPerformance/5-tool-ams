import { index, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import { users } from "@/db/schema";
import playerInformation from "@/db/schema/players/playerInformation";

export const playerCoachRoleEnum = pgEnum("player_coach_role", [
  "primary",
  "secondary",
]);

export const playerCoaches = pgTable(
  "player_coaches",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    playerId: uuid("player_id")
      .notNull()
      .references(() => playerInformation.id, { onDelete: "cascade" }),

    coachId: uuid("coach_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    role: playerCoachRoleEnum("role").notNull(),

    createdOn: timestamp("created_on").defaultNow().notNull(),
  },
  (t) => [
    index("player_coaches_player_idx").on(t.playerId),
    index("player_coaches_coach_idx").on(t.coachId),
  ]
);
