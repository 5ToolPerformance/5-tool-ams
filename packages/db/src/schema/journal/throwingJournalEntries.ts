import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import journalEntries from "./journalEntries";

export const throwingJournalEntries = pgTable(
  "throwing_journal_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    journalEntryId: uuid("journal_entry_id")
      .notNull()
      .references(() => journalEntries.id),

    overallFeel: integer("overall_feel"),
    confidenceScore: integer("confidence_score"),
    sessionNote: text("session_note"),

    createdOn: timestamp("created_on", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedOn: timestamp("updated_on", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("throwing_journal_entries_journal_entry_uidx").on(
      table.journalEntryId
    ),
    index("throwing_journal_entries_overall_feel_idx").on(table.overallFeel),
  ]
);

export default throwingJournalEntries;
