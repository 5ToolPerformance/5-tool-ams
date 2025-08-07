import { relations } from "drizzle-orm";
import { date, pgTable, real, text, uuid } from "drizzle-orm/pg-core";

import users from "./users";

export const playerInformation = pgTable("player_information", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").references(() => users.id, { onDelete: "cascade" }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  profilePictureUrl: text("profile_picture_url"),
  height: real("height").notNull(),
  weight: real("weight").notNull(),
  position: text("position").notNull(),
  throws: text("throws").notNull(),
  hits: text("hits").notNull(),
  date_of_birth: date("date_of_birth", { mode: "string" }).notNull(),
});

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
