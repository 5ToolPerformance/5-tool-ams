import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { facilities, playerInformation, users } from "@/db/schema";
import { accessEnum } from "./users";

/**
 * ------------------------------------------------------------------
 * ENUMS
 * ------------------------------------------------------------------
 */

export const userRoleTypeEnum = pgEnum("user_role_type", [
  "player",
  "coach",
  "admin",
  "client",
]);

export const clientRelationshipTypeEnum = pgEnum("client_relationship_type", [
  "parent",
  "guardian",
  "self",
  "other",
]);

export const clientInviteStatusEnum = pgEnum("client_invite_status", [
  "pending",
  "accepted",
  "expired",
  "revoked",
]);

export const portalAccessStatusEnum = pgEnum("portal_access_status", [
  "active",
  "revoked",
]);

/**
 * ------------------------------------------------------------------
 * USER ROLES
 * ------------------------------------------------------------------
 */

export const userRoles = pgTable(
  "user_roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    facilityId: uuid("facility_id")
      .notNull()
      .references(() => facilities.id, { onDelete: "cascade" }),

    role: userRoleTypeEnum("role").notNull(),
    access: accessEnum("access").default("read/write").notNull(),
    isActive: boolean("is_active").default(true).notNull(),

    createdOn: timestamp("created_on", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("user_roles_user_idx").on(table.userId),
    index("user_roles_facility_idx").on(table.facilityId),
    index("user_roles_role_idx").on(table.role),

    uniqueIndex("user_roles_user_facility_role_unique").on(
      table.userId,
      table.facilityId,
      table.role
    ),
  ]
);

/**
 * ------------------------------------------------------------------
 * CLIENT PROFILES
 * ------------------------------------------------------------------
 */

export const clientProfiles = pgTable(
  "client_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    facilityId: uuid("facility_id")
      .notNull()
      .references(() => facilities.id, { onDelete: "cascade" }),

    firstName: text("first_name"),
    lastName: text("last_name"),
    phone: text("phone"),

    onboardingComplete: boolean("onboarding_complete").default(false).notNull(),

    createdOn: timestamp("created_on", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedOn: timestamp("updated_on", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdx: index("client_profiles_user_idx").on(table.userId),
    facilityIdx: index("client_profiles_facility_idx").on(table.facilityId),

    userFacilityUnique: uniqueIndex("client_profiles_user_facility_unique").on(
      table.userId,
      table.facilityId
    ),
  })
);

/**
 * ------------------------------------------------------------------
 * CLIENT INVITES
 * ------------------------------------------------------------------
 */

export const clientInvites = pgTable(
  "client_invites",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    facilityId: uuid("facility_id")
      .notNull()
      .references(() => facilities.id, { onDelete: "cascade" }),

    email: text("email").notNull(),

    firstName: text("first_name"),
    lastName: text("last_name"),

    relationshipType: clientRelationshipTypeEnum("relationship_type").notNull(),

    status: clientInviteStatusEnum("status").default("pending").notNull(),

    tokenHash: text("token_hash").notNull(),

    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),

    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),

    acceptedByUserId: uuid("accepted_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),

    createdOn: timestamp("created_on", { withTimezone: true })
      .defaultNow()
      .notNull(),

    acceptedOn: timestamp("accepted_on", { withTimezone: true }),
    revokedOn: timestamp("revoked_on", { withTimezone: true }),
  },
  (table) => ({
    emailIdx: index("client_invites_email_idx").on(table.email),
    facilityIdx: index("client_invites_facility_idx").on(table.facilityId),
    statusIdx: index("client_invites_status_idx").on(table.status),

    tokenHashUnique: uniqueIndex("client_invites_token_hash_unique").on(
      table.tokenHash
    ),
  })
);

/**
 * ------------------------------------------------------------------
 * CLIENT INVITE PLAYERS
 * ------------------------------------------------------------------
 */

export const clientInvitePlayers = pgTable(
  "client_invite_players",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    inviteId: uuid("invite_id")
      .notNull()
      .references(() => clientInvites.id, { onDelete: "cascade" }),

    playerId: uuid("player_id")
      .notNull()
      .references(() => playerInformation.id, { onDelete: "cascade" }),

    createdOn: timestamp("created_on", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    inviteIdx: index("client_invite_players_invite_idx").on(table.inviteId),
    playerIdx: index("client_invite_players_player_idx").on(table.playerId),

    invitePlayerUnique: uniqueIndex(
      "client_invite_players_invite_player_unique"
    ).on(table.inviteId, table.playerId),
  })
);

/**
 * ------------------------------------------------------------------
 * PLAYER CLIENT ACCESS
 * ------------------------------------------------------------------
 */

export const playerClientAccess = pgTable(
  "player_client_access",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    facilityId: uuid("facility_id")
      .notNull()
      .references(() => facilities.id, { onDelete: "cascade" }),

    playerId: uuid("player_id")
      .notNull()
      .references(() => playerInformation.id, { onDelete: "cascade" }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    relationshipType: clientRelationshipTypeEnum("relationship_type").notNull(),

    status: portalAccessStatusEnum("status").default("active").notNull(),

    canView: boolean("can_view").default(true).notNull(),
    canLogActivity: boolean("can_log_activity").default(true).notNull(),
    canUpload: boolean("can_upload").default(true).notNull(),
    canMessage: boolean("can_message").default(true).notNull(),

    isPrimaryContact: boolean("is_primary_contact").default(false).notNull(),

    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }),

    createdOn: timestamp("created_on", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedOn: timestamp("updated_on", { withTimezone: true })
      .defaultNow()
      .notNull(),

    revokedOn: timestamp("revoked_on", { withTimezone: true }),
  },
  (table) => ({
    playerIdx: index("player_client_access_player_idx").on(table.playerId),
    userIdx: index("player_client_access_user_idx").on(table.userId),
    facilityIdx: index("player_client_access_facility_idx").on(
      table.facilityId
    ),
    statusIdx: index("player_client_access_status_idx").on(table.status),

    playerUserUnique: uniqueIndex("player_client_access_player_user_unique").on(
      table.playerId,
      table.userId
    ),
  })
);
