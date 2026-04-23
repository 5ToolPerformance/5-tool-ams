// db/schema/athleteContextFlags.ts
import {
    date,
    pgTable,
    text,
    uuid,
} from "drizzle-orm/pg-core";
import playerInformation from "../players/playerInformation";

export const athleteContextFlags = pgTable("athlete_context_flags", {
  athleteId: uuid("athlete_id")
    .references(() => playerInformation.id, { onDelete: "cascade" })
    .notNull(),

  contextType: text("context_type").notNull(), // injury | deload
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  notes: text("notes"),
});
