import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { facilities } from "@/db/schema";

import journalEntries from "./journalEntries";

export const hittingJournalEntries = pgTable(
  "hitting_journal_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    journalEntryId: uuid("journal_entry_id")
      .notNull()
      .references(() => journalEntries.id),

    opponent: text("opponent"),
    teamName: text("team_name"),
    location: text("location"),

    overallFeel: integer("overall_feel"),
    confidenceScore: integer("confidence_score"),

    atBats: integer("at_bats").notNull().default(0),
    plateAppearances: integer("plate_appearances").notNull().default(0),

    summaryNote: text("summary_note"),

    createdOn: timestamp("created_on", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedOn: timestamp("updated_on", { withTimezone: true })
      .defaultNow()
      .notNull(),

    facilityId: uuid("facility_id")
      .notNull()
      .references(() => facilities.id),
  },
  (table) => [
    uniqueIndex("hitting_journal_entries_journal_entry_uidx").on(
      table.journalEntryId
    ),
    index("hitting_journal_entries_opponent_idx").on(table.opponent),
  ]
);

export default hittingJournalEntries;
