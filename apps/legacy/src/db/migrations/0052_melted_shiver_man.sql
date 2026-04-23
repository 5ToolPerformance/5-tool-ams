ALTER TYPE injury_status RENAME TO injury_status_enum_old; --> statement-breakpoint
CREATE TYPE "public"."injury_confidence" AS ENUM('self_reported', 'observed', 'assessed', 'diagnosed');--> statement-breakpoint
CREATE TYPE "public"."injury_level" AS ENUM('soreness', 'injury', 'diagnosis');--> statement-breakpoint
CREATE TYPE "public"."injury_reported_by_role" AS ENUM('coach', 'trainer', 'medical', 'athlete');--> statement-breakpoint
CREATE TYPE "public"."injury_side" AS ENUM('left', 'right', 'bilateral', 'none');--> statement-breakpoint
CREATE TYPE "public"."injury_status" AS ENUM('active', 'limited', 'resolved');--> statement-breakpoint
CREATE TABLE "injury" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"reported_by_user_id" uuid,
	"reported_by_role" "injury_reported_by_role" NOT NULL,
	"level" "injury_level" NOT NULL,
	"body_part_id" uuid NOT NULL,
	"focus_area_id" uuid,
	"side" "injury_side" NOT NULL,
	"status" "injury_status" NOT NULL,
	"confidence" "injury_confidence" NOT NULL,
	"notes" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"created_on" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "injury_body_part" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "injury_focus_area" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"body_part_id" uuid NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "injury" ADD CONSTRAINT "injury_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "injury" ADD CONSTRAINT "injury_reported_by_user_id_user_id_fk" FOREIGN KEY ("reported_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "injury" ADD CONSTRAINT "injury_body_part_id_injury_body_part_id_fk" FOREIGN KEY ("body_part_id") REFERENCES "public"."injury_body_part"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "injury" ADD CONSTRAINT "injury_focus_area_id_injury_focus_area_id_fk" FOREIGN KEY ("focus_area_id") REFERENCES "public"."injury_focus_area"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "injury_focus_area" ADD CONSTRAINT "injury_focus_area_body_part_id_injury_body_part_id_fk" FOREIGN KEY ("body_part_id") REFERENCES "public"."injury_body_part"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "injury_player_idx" ON "injury" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "injury_body_part_idx" ON "injury" USING btree ("body_part_id");--> statement-breakpoint
CREATE INDEX "injury_focus_area_idx" ON "injury" USING btree ("focus_area_id");--> statement-breakpoint
CREATE INDEX "injury_status_idx" ON "injury" USING btree ("status");--> statement-breakpoint
CREATE INDEX "injury_start_date_idx" ON "injury" USING btree ("start_date");