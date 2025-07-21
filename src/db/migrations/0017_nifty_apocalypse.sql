CREATE TYPE "public"."date_range" AS ENUM('1-2', '3-4', '5-6', '7+', 'na');--> statement-breakpoint
CREATE TABLE "hitting_assessment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"coach_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	"notes" text,
	"upper" text,
	"lower" text,
	"head" text,
	"load" text,
	"max_ev" real,
	"line_drive_pct" real,
	"created_on" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pitching_assessment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"coach_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	"notes" text,
	"upper" text,
	"mid" text,
	"lower" text,
	"velo_mound_2oz" real,
	"velo_mound_4oz" real,
	"velo_mound_5oz" real,
	"velo_mound_6oz" real,
	"velo_pull_down_2oz" real,
	"velo_pull_down_4oz" real,
	"velo_pull_down_5oz" real,
	"velo_pull_down_6oz" real,
	"strike_pct" real,
	"goals" text,
	"last_time_pitched" date_range,
	"next_time_pitched" date_range,
	"feel" real,
	"concerns" text,
	"created_on" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "smfa_boolean" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"coach_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	"notes" text,
	"pelvic_rotation_l" boolean NOT NULL,
	"pelvic_rotation_r" boolean NOT NULL,
	"seated_trunk_rotation_l" boolean NOT NULL,
	"seated_trunk_rotation_r" boolean NOT NULL,
	"ankle_test_l" boolean NOT NULL,
	"ankle_test_r" boolean NOT NULL,
	"forearm_test_l" boolean NOT NULL,
	"forearm_test_r" boolean NOT NULL,
	"cervical_rotation_l" boolean NOT NULL,
	"cervical_rotation_r" boolean NOT NULL,
	"msf_l" boolean NOT NULL,
	"msf_r" boolean NOT NULL,
	"mse_l" boolean NOT NULL,
	"mse_r" boolean NOT NULL,
	"msr_l" boolean NOT NULL,
	"msr_r" boolean NOT NULL,
	"pelvic_tilt" boolean NOT NULL,
	"squat_test" boolean NOT NULL,
	"cervical_flexion" boolean NOT NULL,
	"cervical_extension" boolean NOT NULL,
	"lesson_date" timestamp NOT NULL,
	"created_on" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lesson" DROP CONSTRAINT "lesson_player_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "hitting_assessment" ADD CONSTRAINT "hitting_assessment_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pitching_assessment" ADD CONSTRAINT "pitching_assessment_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "smfa_boolean" ADD CONSTRAINT "smfa_boolean_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "hitting_assessment_lesson_idx" ON "hitting_assessment" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "pitching_assessment_lesson_idx" ON "pitching_assessment" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "smfa_boolean_lesson_idx" ON "smfa_boolean" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "smfa_boolean_coach_idx" ON "smfa_boolean" USING btree ("coach_id");--> statement-breakpoint
CREATE INDEX "smfa_boolean_player_idx" ON "smfa_boolean" USING btree ("player_id");--> statement-breakpoint
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;