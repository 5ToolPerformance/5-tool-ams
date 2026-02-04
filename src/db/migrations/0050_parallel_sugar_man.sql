CREATE TYPE "public"."attachment_document_types" AS ENUM('medical', 'pt', 'external', 'eval', 'general', 'other');--> statement-breakpoint
CREATE TYPE "public"."attachment_visibility" AS ENUM('internal', 'private', 'public');--> statement-breakpoint
ALTER TYPE "public"."attachment_types" ADD VALUE 'file_image' BEFORE 'manual';--> statement-breakpoint
ALTER TYPE "public"."attachment_types" ADD VALUE 'file_pdf' BEFORE 'manual';--> statement-breakpoint
ALTER TYPE "public"."attachment_types" ADD VALUE 'file_docx' BEFORE 'manual';--> statement-breakpoint
ALTER TABLE "attachments" ADD COLUMN "visibility" "attachment_visibility" DEFAULT 'internal' NOT NULL;--> statement-breakpoint
ALTER TABLE "attachments" ADD COLUMN "document_type" "attachment_document_types";