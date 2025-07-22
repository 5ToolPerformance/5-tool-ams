import { boolean, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import playerInformation from "../playerInformation";

export const leftRightEnum = pgEnum("left-right", ["left", "right", "switch"]);

export const archetypesEnum = pgEnum("archetypes", ["aerial", "terrestrial"]);

const motorPreferences = pgTable("motor_preferences", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  playerId: uuid("player_id")
    .notNull()
    .references(() => playerInformation.id, { onDelete: "cascade" }),
  coachId: uuid("coach_id").notNull(),
  archetype: archetypesEnum("archetype").notNull(),
  extensionLeg: leftRightEnum("extension_leg").notNull(),
  breath: boolean("breath").notNull(),
  association: boolean("association").notNull(),
  createdOn: timestamp("created_on", { mode: "date" }).notNull().defaultNow(),
  assessmentDate: timestamp("assessment_date", { mode: "date" })
    .notNull()
    .defaultNow(),
});

export default motorPreferences;
