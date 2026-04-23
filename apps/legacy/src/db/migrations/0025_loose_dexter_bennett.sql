CREATE TABLE "hittrax_assessment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"coach_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	"pitch_type" text,
	"avg_exit_velo" real,
	"avg_hard_hit" real,
	"max_velo" real,
	"max_dist" real,
	"fb_and_gb_pct" real,
	"line_drive_pct" real
);
--> statement-breakpoint
CREATE TABLE "velo_assessment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"coach_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	"intent" integer,
	"avg_velo" real,
	"top_velo" real,
	"strike_pct" real
);
--> statement-breakpoint
ALTER TABLE "hittrax_assessment" ADD CONSTRAINT "hittrax_assessment_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "velo_assessment" ADD CONSTRAINT "velo_assessment_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;