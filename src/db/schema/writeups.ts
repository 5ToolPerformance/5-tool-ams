import {
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { playerInformation, users } from "@/db/schema";

const writeups = pgTable("writeups", {
  id: serial("id").primaryKey(),
  coachId: integer("coach_id")
    .notNull()
    .references(() => users.id),
  playerId: integer("player_id")
    .notNull()
    .references(() => playerInformation.id),
  writeupType: text("writeup_type").notNull(),
  content: jsonb("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export default writeups;
