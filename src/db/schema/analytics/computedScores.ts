// db/schema/computedScores.ts
import {
    pgTable,
    real,
    text,
    timestamp,
    uuid
} from "drizzle-orm/pg-core";
import playerInformation from "../players/playerInformation";

export const computedScores = pgTable("computed_scores", {
  id: uuid("id").defaultRandom().primaryKey(),

  athleteId: uuid("athlete_id")
    .references(() => playerInformation.id, { onDelete: "cascade" })
    .notNull(),

  scoreType: text("score_type").notNull(), // power_rating
  scoreValue: real("score_value").notNull(),

  version: text("version").notNull(), // v1.0, v1.1
  calculatedAt: timestamp("calculated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
