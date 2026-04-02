CREATE TYPE "public"."hitting_outcome" AS ENUM('single', 'double', 'triple', 'home_run', 'walk', 'strikeout', 'hit_by_pitch', 'sac_fly', 'sac_bunt', 'line_out', 'ground_out', 'fly_out', 'reach_on_error', 'fielder_choice', 'other');--> statement-breakpoint
CREATE TYPE "public"."journal_context_type" AS ENUM('game', 'practice', 'home', 'gym', 'facility', 'lesson', 'other');--> statement-breakpoint
CREATE TYPE "public"."journal_entry_type" AS ENUM('throwing', 'hitting', 'strength', 'wellness', 'other');--> statement-breakpoint
CREATE TYPE "public"."journal_log_source" AS ENUM('player', 'parent', 'coach', 'import');--> statement-breakpoint
CREATE TYPE "public"."readiness_status" AS ENUM('green', 'yellow', 'red');--> statement-breakpoint
CREATE TYPE "public"."throw_intent" AS ENUM('low', 'moderate', 'high', 'max');--> statement-breakpoint
CREATE TYPE "public"."throw_type" AS ENUM('recovery_catch', 'catch_play', 'long_toss', 'flat_ground', 'bullpen', 'game', 'pulldown', 'other');--> statement-breakpoint
CREATE TYPE "public"."workload_quality" AS ENUM('type_only', 'intent_based', 'velocity_based', 'mixed');--> statement-breakpoint
CREATE TABLE "hitting_journal_at_bats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hitting_journal_entry_id" uuid NOT NULL,
	"at_bat_number" integer NOT NULL,
	"outcome" "hitting_outcome" NOT NULL,
	"result_category" text,
	"pitch_type_seen" text,
	"pitch_location" text,
	"count_at_result" text,
	"runners_in_scoring_position" boolean,
	"rbi" integer,
	"notes" text,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_on" timestamp with time zone DEFAULT now() NOT NULL,
	"facility_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hitting_journal_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"journal_entry_id" uuid NOT NULL,
	"opponent" text,
	"team_name" text,
	"location" text,
	"overall_feel" integer,
	"confidence_score" integer,
	"at_bats" integer DEFAULT 0 NOT NULL,
	"plate_appearances" integer DEFAULT 0 NOT NULL,
	"summary_note" text,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_on" timestamp with time zone DEFAULT now() NOT NULL,
	"facility_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "journal_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"logged_by_user_id" uuid,
	"entry_date" date NOT NULL,
	"entry_type" "journal_entry_type" NOT NULL,
	"source" "journal_log_source" DEFAULT 'player' NOT NULL,
	"context_type" "journal_context_type",
	"title" text,
	"summary_note" text,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_on" timestamp with time zone DEFAULT now() NOT NULL,
	"facility_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "throwing_arm_checkins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"throwing_journal_entry_id" uuid NOT NULL,
	"arm_soreness" integer,
	"body_fatigue" integer,
	"arm_fatigue" integer,
	"recovery_score" integer,
	"feels_off" boolean,
	"status_note" text,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_on" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "throwing_journal_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"journal_entry_id" uuid NOT NULL,
	"overall_feel" integer,
	"confidence_score" integer,
	"session_note" text,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_on" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "throwing_workload_daily_summaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"summary_date" date NOT NULL,
	"performance_session_id" uuid,
	"total_throw_count" integer DEFAULT 0 NOT NULL,
	"total_pitch_count" integer DEFAULT 0 NOT NULL,
	"workload_units" real DEFAULT 0 NOT NULL,
	"workload_quality" "workload_quality" DEFAULT 'type_only' NOT NULL,
	"workload_confidence" integer,
	"acute_7_load" real,
	"chronic_28_load" real,
	"acute_chronic_ratio" real,
	"soreness_score" integer,
	"fatigue_score" integer,
	"readiness_score" integer,
	"readiness_status" "readiness_status",
	"readiness_reason" text,
	"entry_count" integer DEFAULT 0 NOT NULL,
	"has_game_exposure" boolean DEFAULT false NOT NULL,
	"has_bullpen" boolean DEFAULT false NOT NULL,
	"has_high_intent_exposure" boolean DEFAULT false NOT NULL,
	"calculated_on" timestamp with time zone,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_on" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "throwing_workload_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"throwing_journal_entry_id" uuid NOT NULL,
	"throw_type" "throw_type" NOT NULL,
	"throw_count" integer NOT NULL,
	"pitch_count" integer,
	"intent_level" "throw_intent",
	"velocity_avg" real,
	"velocity_max" real,
	"pitch_type" text,
	"duration_minutes" integer,
	"notes" text,
	"is_estimated" boolean DEFAULT false NOT NULL,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_on" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hitting_journal_at_bats" ADD CONSTRAINT "hitting_journal_at_bats_hitting_journal_entry_id_hitting_journal_entries_id_fk" FOREIGN KEY ("hitting_journal_entry_id") REFERENCES "public"."hitting_journal_entries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hitting_journal_at_bats" ADD CONSTRAINT "hitting_journal_at_bats_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hitting_journal_entries" ADD CONSTRAINT "hitting_journal_entries_journal_entry_id_journal_entries_id_fk" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hitting_journal_entries" ADD CONSTRAINT "hitting_journal_entries_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_logged_by_user_id_user_id_fk" FOREIGN KEY ("logged_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "throwing_arm_checkins" ADD CONSTRAINT "throwing_arm_checkins_throwing_journal_entry_id_throwing_journal_entries_id_fk" FOREIGN KEY ("throwing_journal_entry_id") REFERENCES "public"."throwing_journal_entries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "throwing_journal_entries" ADD CONSTRAINT "throwing_journal_entries_journal_entry_id_journal_entries_id_fk" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "throwing_workload_daily_summaries" ADD CONSTRAINT "throwing_workload_daily_summaries_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "throwing_workload_daily_summaries" ADD CONSTRAINT "throwing_workload_daily_summaries_performance_session_id_performance_session_id_fk" FOREIGN KEY ("performance_session_id") REFERENCES "public"."performance_session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "throwing_workload_entries" ADD CONSTRAINT "throwing_workload_entries_throwing_journal_entry_id_throwing_journal_entries_id_fk" FOREIGN KEY ("throwing_journal_entry_id") REFERENCES "public"."throwing_journal_entries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "hitting_journal_at_bats_entry_idx" ON "hitting_journal_at_bats" USING btree ("hitting_journal_entry_id");--> statement-breakpoint
CREATE INDEX "hitting_journal_at_bats_outcome_idx" ON "hitting_journal_at_bats" USING btree ("outcome");--> statement-breakpoint
CREATE INDEX "hitting_journal_at_bats_entry_ab_number_idx" ON "hitting_journal_at_bats" USING btree ("hitting_journal_entry_id","at_bat_number");--> statement-breakpoint
CREATE UNIQUE INDEX "hitting_journal_entries_journal_entry_uidx" ON "hitting_journal_entries" USING btree ("journal_entry_id");--> statement-breakpoint
CREATE INDEX "hitting_journal_entries_opponent_idx" ON "hitting_journal_entries" USING btree ("opponent");--> statement-breakpoint
CREATE INDEX "journal_entries_player_idx" ON "journal_entries" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "journal_entries_entry_date_idx" ON "journal_entries" USING btree ("entry_date");--> statement-breakpoint
CREATE INDEX "journal_entries_player_date_idx" ON "journal_entries" USING btree ("player_id","entry_date");--> statement-breakpoint
CREATE INDEX "journal_entries_entry_type_idx" ON "journal_entries" USING btree ("entry_type");--> statement-breakpoint
CREATE INDEX "journal_entries_logged_by_idx" ON "journal_entries" USING btree ("logged_by_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "throwing_arm_checkins_throwing_entry_uidx" ON "throwing_arm_checkins" USING btree ("throwing_journal_entry_id");--> statement-breakpoint
CREATE INDEX "throwing_arm_checkins_arm_soreness_idx" ON "throwing_arm_checkins" USING btree ("arm_soreness");--> statement-breakpoint
CREATE UNIQUE INDEX "throwing_journal_entries_journal_entry_uidx" ON "throwing_journal_entries" USING btree ("journal_entry_id");--> statement-breakpoint
CREATE INDEX "throwing_journal_entries_overall_feel_idx" ON "throwing_journal_entries" USING btree ("overall_feel");--> statement-breakpoint
CREATE UNIQUE INDEX "throwing_workload_daily_summaries_player_date_uidx" ON "throwing_workload_daily_summaries" USING btree ("player_id","summary_date");--> statement-breakpoint
CREATE UNIQUE INDEX "throwing_workload_daily_summaries_performance_session_uidx" ON "throwing_workload_daily_summaries" USING btree ("performance_session_id");--> statement-breakpoint
CREATE INDEX "throwing_workload_daily_summaries_summary_date_idx" ON "throwing_workload_daily_summaries" USING btree ("summary_date");--> statement-breakpoint
CREATE INDEX "throwing_workload_daily_summaries_player_readiness_idx" ON "throwing_workload_daily_summaries" USING btree ("player_id","readiness_status");--> statement-breakpoint
CREATE INDEX "throwing_workload_entries_throwing_entry_idx" ON "throwing_workload_entries" USING btree ("throwing_journal_entry_id");--> statement-breakpoint
CREATE INDEX "throwing_workload_entries_throw_type_idx" ON "throwing_workload_entries" USING btree ("throw_type");--> statement-breakpoint
CREATE INDEX "throwing_workload_entries_intent_idx" ON "throwing_workload_entries" USING btree ("intent_level");