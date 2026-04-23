CREATE TYPE "public"."attachment_types" AS ENUM('file_csv', 'file_video', 'manual');--> statement-breakpoint
CREATE TABLE "attachment_files" (
	"attachment_id" uuid PRIMARY KEY NOT NULL,
	"storage_provider" text NOT NULL,
	"storage_key" text NOT NULL,
	"original_file_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"file_size_bytes" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"athlete_id" uuid,
	"facility_id" uuid,
	"lesson_player_id" uuid,
	"type" "attachment_types" NOT NULL,
	"source" text NOT NULL,
	"evidence_category" text,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "facilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "facilities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "attachment_files" ADD CONSTRAINT "attachment_files_attachment_id_attachments_id_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."attachments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_athlete_id_player_information_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_lesson_player_id_lesson_players_id_fk" FOREIGN KEY ("lesson_player_id") REFERENCES "public"."lesson_players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_created_by_player_information_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."player_information"("id") ON DELETE set null ON UPDATE no action;