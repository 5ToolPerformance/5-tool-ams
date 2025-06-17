import { boolean, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import { leftRightEnum } from "..";

export const archetypesEnum = pgEnum("archetypes", ["aerial", "terrestrial"]);

const motorPreferences = pgTable("motor_preferences", {
  id: uuid("id").defaultRandom().notNull(),
  playerId: uuid("player_id").notNull(),
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
