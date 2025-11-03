import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { playerInformation, users } from "@/db/schema";

const writeups = pgTable("writeups", {
  id: uuid("id").primaryKey().defaultRandom(),
  coachId: uuid("coach_id")
    .notNull()
    .references(() => users.id),
  playerId: uuid("player_id")
    .notNull()
    .references(() => playerInformation.id),
  writeupType: text("writeup_type").notNull(),
  notes: text("notes"),
  content: jsonb("content").notNull(),
  createdOn: timestamp("created_on", { mode: "string" }).defaultNow(),
});

export default writeups;
