import { relations } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import playerInformation from "./players/playerInformation";

export const rolesEnum = pgEnum("roles", ["player", "coach", "admin"]);
export const accessEnum = pgEnum("access", [
  "read/write",
  "read-only",
  "write-only",
]);

const users = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }).notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: varchar("image", { length: 2048 }),
  role: rolesEnum("role").default("coach"),
  username: varchar("username", { length: 25 }).unique(),
  access: accessEnum("access").default("read/write"),
  isActive: boolean("is_active").default(true),
});

export default users;

export const usersRelations = relations(users, ({ one }) => ({
  playerInfo: one(playerInformation, {
    fields: [users.id],
    references: [playerInformation.userId],
  }),
}));
