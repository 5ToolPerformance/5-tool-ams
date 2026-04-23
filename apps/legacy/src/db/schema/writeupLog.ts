import {
  date,
  index,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { playerInformation, users } from "@/db/schema";

// schema/writeups.ts
export const writeupLog = pgTable(
  "writeup_log",
  {
    id: serial("id").primaryKey(),
    playerId: uuid("player_id")
      .notNull()
      .references(() => playerInformation.id),
    writeupType: varchar("writeup_type", { length: 50 }).notNull(),
    writeupDate: date("writeup_date", { mode: "string" }).notNull(),
    coachId: uuid("coach_id").references(() => users.id),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("writeup_log_player_id_idx").on(table.playerId),
    index("writeup_log_date_idx").on(table.writeupDate),
    index("writeup_log_coach_id_idx").on(table.coachId),
  ]
);
