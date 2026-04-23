import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { authProviderEnum } from "./allowedUsers";
import playerInformation from "./players/playerInformation";
import users from "./users";

export const playerAccountLinkActionEnum = pgEnum("player_account_link_action", [
  "linked",
  "reassigned",
  "unlinked_existing_user",
]);

export const playerAccountLinkAudit = pgTable("player_account_link_audit", {
  id: uuid("id").defaultRandom().primaryKey(),
  playerId: uuid("player_id")
    .notNull()
    .references(() => playerInformation.id, { onDelete: "cascade" }),
  previousUserId: uuid("previous_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  nextUserId: uuid("next_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  linkedEmail: text("linked_email").notNull(),
  provider: authProviderEnum("provider").notNull(),
  actionByAdminId: uuid("action_by_admin_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  action: playerAccountLinkActionEnum("action").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});
