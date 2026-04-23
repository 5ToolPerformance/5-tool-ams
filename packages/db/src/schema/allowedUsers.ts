import {
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const authProviderEnum = pgEnum("auth_provider", ["google", "entra"]);
export const allowedUserStatusEnum = pgEnum("allowed_user_status", [
  "invited",
  "active",
  "revoked",
]);

export const allowedUsers = pgTable(
  "allowed_users",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Normalize emails to lowercase in your app logic
    email: varchar("email", { length: 255 }).notNull(),

    provider: authProviderEnum("provider").notNull(),
    status: allowedUserStatusEnum("status").notNull().default("invited"),

    // If you’re not multi-org yet, you can still keep this for future-proofing.
    organizationId: uuid("organization_id").notNull(),

    // intended role for assignment / gating (you can keep it simple for now)
    role: varchar("role", { length: 50 }).notNull(), // "coach" | "admin" | etc

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    // Prevent duplicates per org/provider/email
    uniqAllowedUser: uniqueIndex("allowed_users_org_provider_email_uniq").on(
      t.organizationId,
      t.provider,
      t.email
    ),
  })
);
