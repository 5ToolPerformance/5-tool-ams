// db/schema/athleteEvents.ts
import {
  date,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { playerInformation } from "../players/playerInformation";

export const athleteEvents = pgTable("athlete_events", {
  id: uuid("id").defaultRandom().primaryKey(),

  athleteId: uuid("athlete_id")
    .references(() => playerInformation.id, { onDelete: "cascade" })
    .notNull(),

  eventType: text("event_type").notNull(), // lesson | injury | deload | test
  eventDate: date("event_date").notNull(),

  label: text("label").notNull(), // "Hamstring Strain", "Max Velocity Day"

  metadata: jsonb("metadata"), // flexible details (coach, volume, severity)

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
