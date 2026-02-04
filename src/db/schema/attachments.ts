import {
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { lessonPlayers, playerInformation, users } from "@/db/schema";
import { facilities } from "@/db/schema/facilities";

export const attachmentTypesEnum = pgEnum("attachment_types", [
  "file_csv",
  "file_video",
  "file_image",
  "file_pdf",
  "file_docx",
  "manual",
]);

export const attachmentVisibilityEnum = pgEnum("attachment_visibility", [
  "internal",
  "private",
  "public",
]);

export const attachmentDocumentTypesEnum = pgEnum(
  "attachment_document_types",
  ["medical", "pt", "external", "eval", "general", "other"]
);

export const attachments = pgTable("attachments", {
  id: uuid("id").defaultRandom().primaryKey(),
  athleteId: uuid("athlete_id").references(() => playerInformation.id, {
    onDelete: "cascade",
  }),
  facilityId: uuid("facility_id").references(() => facilities.id, {
    onDelete: "cascade",
  }),
  lessonPlayerId: uuid("lesson_player_id").references(() => lessonPlayers.id, {
    onDelete: "cascade",
  }),
  type: attachmentTypesEnum("type").notNull(),
  source: text("source").notNull(),
  evidenceCategory: text("evidence_category"),
  visibility: attachmentVisibilityEnum("visibility")
    .notNull()
    .default("internal"),
  documentType: attachmentDocumentTypesEnum("document_type"),
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { mode: "string" }),
});

export const attachmentFiles = pgTable("attachment_files", {
  attachmentId: uuid("attachment_id")
    .references(() => attachments.id, {
      onDelete: "cascade",
    })
    .primaryKey(),
  storageProvider: text("storage_provider").notNull(),
  storageKey: text("storage_key").notNull(),
  originalFileName: text("original_file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSizeBytes: real("file_size_bytes").notNull(),
});
