import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { facilities } from "@/db/schema/facilities";

import { hittingOutcomeEnum } from "./enums";
import hittingJournalEntries from "./hittingJournalEntries";

export const hittingJournalAtBats = pgTable(
  "hitting_journal_at_bats",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    hittingJournalEntryId: uuid("hitting_journal_entry_id")
      .notNull()
      .references(() => hittingJournalEntries.id),

    atBatNumber: integer("at_bat_number").notNull(),

    outcome: hittingOutcomeEnum("outcome").notNull(),

    resultCategory: text("result_category"),
    pitchTypeSeen: text("pitch_type_seen"),
    pitchLocation: text("pitch_location"),
    countAtResult: text("count_at_result"),

    runnersInScoringPosition: boolean("runners_in_scoring_position"),
    rbi: integer("rbi"),

    notes: text("notes"),

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
    index("hitting_journal_at_bats_entry_idx").on(table.hittingJournalEntryId),
    index("hitting_journal_at_bats_outcome_idx").on(table.outcome),
    index("hitting_journal_at_bats_entry_ab_number_idx").on(
      table.hittingJournalEntryId,
      table.atBatNumber
    ),
  ]
);

export default hittingJournalAtBats;
