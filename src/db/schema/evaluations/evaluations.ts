import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "@/db/schema";
import playerInformation from "@/db/schema/players/playerInformation";

export const evaluationTypeEnum = pgEnum("evaluation_type", [
  "baseline",
  "monthly",
  "season_review",
  "injury_return",
]);

export const evaluations = pgTable(
  "evaluations",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    playerId: uuid("player_id")
      .notNull()
      .references(() => playerInformation.id, { onDelete: "cascade" }),

    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id),

    evaluationDate: timestamp("evaluation_date").notNull(),

    evaluationType: evaluationTypeEnum("evaluation_type").notNull(),

    notes: text("notes"),

    createdOn: timestamp("created_on").defaultNow().notNull(),
  },
  (t) => [index("evaluations_player_idx").on(t.playerId)]
);
