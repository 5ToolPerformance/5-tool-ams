import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./";

export const fileKindEnum = pgEnum("file_kind", ["original", "converted"]);

export const files = pgTable("files", {
  id: uuid("id").primaryKey().defaultRandom(),

  storageKey: text("storage_key").notNull(), // Azure blob key
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),

  kind: fileKindEnum("kind").default("original").notNull(),

  uploadedBy: uuid("uploaded_by")
    .notNull()
    .references(() => users.id),

  createdOn: timestamp("created_on", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const fileEntityEnum = pgEnum("file_entity_type", [
  "player",
  "lesson",
  "injury",
  "drill",
]);

export const fileLinks = pgTable("file_links", {
  id: uuid("id").primaryKey().defaultRandom(),

  fileId: uuid("file_id")
    .notNull()
    .references(() => files.id, { onDelete: "cascade" }),

  entityType: fileEntityEnum("entity_type").notNull(),

  entityId: uuid("entity_id").notNull(),

  createdOn: timestamp("created_on", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
