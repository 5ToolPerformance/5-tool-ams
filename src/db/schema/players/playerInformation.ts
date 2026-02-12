import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { facilities } from "../facilities";
import users from "../users";

export const sportsEnum = pgEnum("sports", ["baseball", "softball"]);

export const playerInformation = pgTable(
  "player_information",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("userId").references(() => users.id, { onDelete: "cascade" }),
    facilityId: uuid("facility_id").references(() => facilities.id, {
      onDelete: "set null",
    }),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    profilePictureUrl: text("profile_picture_url"),
    height: real("height").notNull(),
    weight: real("weight").notNull(),
    position: text("position").notNull(),
    throws: text("throws").notNull(),
    hits: text("hits").notNull(),
    prospect: boolean("prospect").notNull().default(false),
    date_of_birth: date("date_of_birth", { mode: "string" }).notNull(),
    sport: sportsEnum("sport").notNull().default("baseball"),
    primaryCoachId: uuid("primary_coach_id").references(() => users.id),
    created_at: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
    updated_at: timestamp("updated_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("player_information_facility_idx").on(table.facilityId),
    index("player_information_user_id_idx").on(table.userId),
  ]
);

export default playerInformation;

// Define relations
export const playerInformationRelations = relations(
  playerInformation,
  ({ one }) => ({
    user: one(users, {
      fields: [playerInformation.userId],
      references: [users.id],
    }),
  })
);
