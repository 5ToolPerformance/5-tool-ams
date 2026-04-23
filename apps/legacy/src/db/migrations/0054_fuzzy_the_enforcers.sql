CREATE TYPE "public"."file_entity_type" AS ENUM('player', 'lesson', 'injury', 'drill');--> statement-breakpoint
CREATE TYPE "public"."file_kind" AS ENUM('original', 'converted');--> statement-breakpoint
CREATE TABLE "drill_tag_links" (
	"drill_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "drill_tag_links_drill_id_tag_id_pk" PRIMARY KEY("drill_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "drill_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "drill_tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "drills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"created_by" uuid NOT NULL,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_on" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "file_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_id" uuid NOT NULL,
	"entity_type" "file_entity_type" NOT NULL,
	"entity_id" uuid NOT NULL,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"storage_key" text NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size" integer NOT NULL,
	"kind" "file_kind" DEFAULT 'original' NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_injury_id_injury_id_fk";
--> statement-breakpoint
ALTER TABLE "drill_tag_links" ADD CONSTRAINT "drill_tag_links_drill_id_drills_id_fk" FOREIGN KEY ("drill_id") REFERENCES "public"."drills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drill_tag_links" ADD CONSTRAINT "drill_tag_links_tag_id_drill_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."drill_tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drills" ADD CONSTRAINT "drills_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_links" ADD CONSTRAINT "file_links_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_uploaded_by_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments" DROP COLUMN "injury_id";