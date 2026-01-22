-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."access" AS ENUM('read/write', 'read-only', 'write-only');--> statement-breakpoint
CREATE TYPE "public"."allowed_user_status" AS ENUM('invited', 'active', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."archetypes" AS ENUM('aerial', 'terrestrial');--> statement-breakpoint
CREATE TYPE "public"."assessment_type" AS ENUM('are_care', 'smfa', 'force_plate', 'true_strength', 'arm_care', 'hitting_assessment', 'pitching_assessment', 'hit_trax_assessment', 'velo_assessment', 'fielding_assessment', 'catching_assessment');--> statement-breakpoint
CREATE TYPE "public"."auth_provider" AS ENUM('google', 'entra');--> statement-breakpoint
CREATE TYPE "public"."date_range" AS ENUM('1-2', '3-4', '5-6', '7+', 'na');--> statement-breakpoint
CREATE TYPE "public"."external_system" AS ENUM('armcare', 'trackman', 'hittrax', 'hawkin');--> statement-breakpoint
CREATE TYPE "public"."injury_severity" AS ENUM('mild', 'moderate', 'severe', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."injury_status" AS ENUM('active', 'resolved', 'recurring', 'monitoring');--> statement-breakpoint
CREATE TYPE "public"."left-right" AS ENUM('left', 'right', 'switch');--> statement-breakpoint
CREATE TYPE "public"."lesson_types" AS ENUM('strength', 'hitting', 'pitching', 'fielding', 'catching');--> statement-breakpoint
CREATE TYPE "public"."lesson_types_old" AS ENUM('strength', 'hitting', 'pithing', 'fielding', 'pitching');--> statement-breakpoint
CREATE TYPE "public"."linking_method" AS ENUM('email_match', 'phone', 'manual', 'name_match', 'external_id');--> statement-breakpoint
CREATE TYPE "public"."linking_status" AS ENUM('active', 'pending', 'inactive', 'failed');--> statement-breakpoint
CREATE TYPE "public"."mechanic_type" AS ENUM('pitching', 'hitting', 'fielding', 'catching', 'strength');--> statement-breakpoint
CREATE TYPE "public"."roles" AS ENUM('player', 'coach', 'admin');--> statement-breakpoint
CREATE TYPE "public"."sports" AS ENUM('baseball', 'softball');--> statement-breakpoint
CREATE TYPE "public"."sync_status" AS ENUM('running', 'success', 'partial_success', 'failed');--> statement-breakpoint
CREATE TABLE "player_information" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid,
	"height" real NOT NULL,
	"weight" real NOT NULL,
	"position" text NOT NULL,
	"throws" text NOT NULL,
	"hits" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"profile_picture_url" text,
	"date_of_birth" date,
	"prospect" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"sport" "sports" DEFAULT 'baseball' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"notes" text,
	"lesson_date" timestamp NOT NULL,
	"created_on" timestamp DEFAULT now() NOT NULL,
	"coachId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"email" varchar(320) NOT NULL,
	"emailVerified" timestamp,
	"image" varchar(2048),
	"role" "roles" DEFAULT 'coach',
	"username" varchar(25),
	"access" "access" DEFAULT 'read/write',
	"is_active" boolean DEFAULT true,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "arm_care" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"coach_id" uuid NOT NULL,
	"notes" text,
	"shoulder_er_l" real NOT NULL,
	"shoulder_er_r" real NOT NULL,
	"shoulder_ir_l" real NOT NULL,
	"shoulder_ir_r" real NOT NULL,
	"shoulder_flexion_l" real NOT NULL,
	"shoulder_flexion_r" real NOT NULL,
	"supine_hip_er_l" real NOT NULL,
	"supine_hip_er_r" real NOT NULL,
	"supine_hip_ir_l" real NOT NULL,
	"supine_hip_ir_r" real NOT NULL,
	"straight_leg_l" real NOT NULL,
	"straight_leg_r" real NOT NULL,
	"lesson_date" timestamp NOT NULL,
	"created_on" timestamp DEFAULT now() NOT NULL,
	"lesson_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hawkins_force_plate" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"coach_id" uuid NOT NULL,
	"notes" text,
	"cmj" real NOT NULL,
	"drop_jump" real NOT NULL,
	"pogo" real NOT NULL,
	"mid_thigh_pull" real NOT NULL,
	"mtp_time" real NOT NULL,
	"cop_ml_l" real NOT NULL,
	"cop_ml_r" real NOT NULL,
	"cop_ap_l" real NOT NULL,
	"cop_ap_r" real NOT NULL,
	"lesson_date" timestamp NOT NULL,
	"created_on" timestamp DEFAULT now() NOT NULL,
	"lesson_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "smfa" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"coach_id" uuid NOT NULL,
	"notes" text,
	"pelvic_rotation_l" real NOT NULL,
	"pelvic_rotation_r" real NOT NULL,
	"seated_trunk_rotation_l" real NOT NULL,
	"seated_trunk_rotation_r" real NOT NULL,
	"ankle_test_l" real NOT NULL,
	"ankle_test_r" real NOT NULL,
	"forearm_test_l" real NOT NULL,
	"forearm_test_r" real NOT NULL,
	"cervical_rotation_l" real NOT NULL,
	"cervical_rotation_r" real NOT NULL,
	"msf_l" real NOT NULL,
	"msf_r" real NOT NULL,
	"mse_l" real NOT NULL,
	"mse_r" real NOT NULL,
	"msr_l" real NOT NULL,
	"msr_r" real NOT NULL,
	"pelvic_tilt" real NOT NULL,
	"squat_test" real NOT NULL,
	"cervical_flexion" real NOT NULL,
	"cervical_extension" real NOT NULL,
	"lesson_date" timestamp NOT NULL,
	"created_on" timestamp DEFAULT now() NOT NULL,
	"lesson_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "true_strength" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"coach_id" uuid NOT NULL,
	"notes" text,
	"seated_shoulder_er_l" real NOT NULL,
	"seated_shoulder_er_r" real NOT NULL,
	"seated_shoulder_ir_l" real NOT NULL,
	"seated_shoulder_ir_r" real NOT NULL,
	"shoulder_rotation_l" real NOT NULL,
	"shoulder_rotation_r" real NOT NULL,
	"shoulder_rotation_rfd_l" real NOT NULL,
	"shoulder_rotation_rfd_r" real NOT NULL,
	"hip_rotation_l" real NOT NULL,
	"hip_rotation_r" real NOT NULL,
	"hip_rotation_rfd_l" real NOT NULL,
	"hip_rotation_rfd_r" real NOT NULL,
	"lesson_date" timestamp NOT NULL,
	"created_on" timestamp DEFAULT now() NOT NULL,
	"lesson_id" uuid NOT NULL
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
CREATE TABLE "lesson" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"coach_id" uuid NOT NULL,
	"lesson_type" "lesson_types" NOT NULL,
	"notes" text,
	"created_on" timestamp DEFAULT now() NOT NULL,
	"lesson_date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player_measurements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"height" real NOT NULL,
	"weight" real NOT NULL,
	"recorded_on" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fielding_assessment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"coach_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	"glovework" text,
	"footwork" text,
	"throwing" text,
	"throwdown_counter" real NOT NULL,
	"live" text,
	"consistency" text,
	"situational" text,
	"created_on" timestamp DEFAULT now() NOT NULL,
	"lesson_date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "catching_assessment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"coach_id" uuid NOT NULL,
	"lesson_id" uuid NOT NULL,
	"feel" integer,
	"last_4" integer,
	"ready_by" integer,
	"catch_throw" text,
	"receiving" text,
	"blocking" text,
	"iq" text,
	"mobility" text,
	"num_throws" integer
);
--> statement-breakpoint
CREATE TABLE "writeups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coach_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"writeup_type" text NOT NULL,
	"content" jsonb NOT NULL,
	"created_on" timestamp DEFAULT now(),
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "player_injuries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid,
	"injury_type" text NOT NULL,
	"injury_date" timestamp NOT NULL,
	"status" "injury_status" DEFAULT 'active' NOT NULL,
	"severity" "injury_severity" DEFAULT 'unknown' NOT NULL,
	"description" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
	"line_drive_pct" real,
	"created_on" date DEFAULT now() NOT NULL,
	"lesson_date" date
);
--> statement-breakpoint
CREATE TABLE "motor_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"coach_id" uuid NOT NULL,
	"archetype" "archetypes" NOT NULL,
	"extension_leg" "left-right" NOT NULL,
	"breath" boolean NOT NULL,
	"association" boolean NOT NULL,
	"created_on" timestamp DEFAULT now() NOT NULL,
	"assessment_date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"assessment_type" "assessment_type" NOT NULL,
	"assessment_id" uuid NOT NULL,
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
	"created_on" timestamp DEFAULT now() NOT NULL,
	"lesson_date" timestamp
);
--> statement-breakpoint
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
CREATE TABLE "external_systems_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"system" "external_system" NOT NULL,
	"sync_enabled" boolean DEFAULT true,
	"sync_frequency" text DEFAULT 'daily',
	"last_sync_at" timestamp,
	"last_sync_status" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "external_systems_config_system_unique" UNIQUE("system")
);
--> statement-breakpoint
CREATE TABLE "external_systems_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"system" "external_system" NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "external_systems_tokens_system_unique" UNIQUE("system")
);
--> statement-breakpoint
CREATE TABLE "armcare_exams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"external_exam_id" text NOT NULL,
	"exam_date" date NOT NULL,
	"exam_time" time,
	"exam_type" text,
	"timezone" text,
	"arm_score" numeric,
	"total_strength" numeric,
	"shoulder_balance" numeric,
	"velo" numeric,
	"svr" numeric,
	"total_strength_post" numeric,
	"post_strength_loss" numeric,
	"total_percent_fresh" numeric,
	"raw_data" jsonb NOT NULL,
	"synced_at" timestamp DEFAULT now() NOT NULL,
	"sync_log_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "armcare_exams_external_exam_id_unique" UNIQUE("external_exam_id")
);
--> statement-breakpoint
CREATE TABLE "external_sync_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"system" "external_system" NOT NULL,
	"status" "sync_status" NOT NULL,
	"records_created" integer DEFAULT 0,
	"records_updated" integer DEFAULT 0,
	"records_skipped" integer DEFAULT 0,
	"records_failed" integer DEFAULT 0,
	"players_matched" integer DEFAULT 0,
	"players_unmatched" integer DEFAULT 0,
	"new_match_suggestions" integer DEFAULT 0,
	"started_at" timestamp NOT NULL,
	"completed_at" timestamp,
	"duration" integer,
	"errors" jsonb,
	"triggered_by" text,
	"triggered_by_user_id" uuid
);
--> statement-breakpoint
CREATE TABLE "armcare_exams_unmatched" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_exam_id" text NOT NULL,
	"external_player_id" text NOT NULL,
	"external_email" text,
	"external_first_name" text,
	"external_last_name" text,
	"exam_date" date NOT NULL,
	"exam_time" time,
	"exam_type" text,
	"timezone" text,
	"arm_score" numeric,
	"total_strength" numeric,
	"shoulder_balance" numeric,
	"velo" numeric,
	"svr" numeric,
	"total_strength_post" numeric,
	"post_strength_loss" numeric,
	"total_percent_fresh" numeric,
	"raw_data" jsonb NOT NULL,
	"match_attempts" integer DEFAULT 0,
	"last_match_attempt" timestamp,
	"match_errors" jsonb,
	"synced_at" timestamp DEFAULT now() NOT NULL,
	"sync_log_id" uuid,
	"status" text DEFAULT 'pending' NOT NULL,
	"resolved_at" timestamp,
	"resolved_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "armcare_exams_unmatched_external_exam_id_unique" UNIQUE("external_exam_id")
);
--> statement-breakpoint
CREATE TABLE "external_athlete_ids" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"external_system" "external_system" NOT NULL,
	"external_id" text NOT NULL,
	"external_email" text,
	"linking_method" "linking_method" NOT NULL,
	"linking_status" "linking_status" DEFAULT 'active' NOT NULL,
	"confidence" numeric,
	"external_metadata" jsonb,
	"linked_by" uuid,
	"linked_at" timestamp DEFAULT now() NOT NULL,
	"verified_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
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
	"strike_pct" real,
	"created_on" date DEFAULT now() NOT NULL,
	"lesson_date" date
);
--> statement-breakpoint
CREATE TABLE "writeup_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"player_id" uuid NOT NULL,
	"writeup_type" varchar(50) NOT NULL,
	"writeup_date" date NOT NULL,
	"coach_id" uuid,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "allowed_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"provider" "auth_provider" NOT NULL,
	"status" "allowed_user_status" DEFAULT 'invited' NOT NULL,
	"organization_id" uuid NOT NULL,
	"role" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hawkins_cmj" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"external_unique_id" text NOT NULL,
	"athlete_id" text NOT NULL,
	"athlete_name" text,
	"test_type_name" text NOT NULL,
	"test_type_canonical_id" text NOT NULL,
	"raw_data" jsonb NOT NULL,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"jump_height_m" numeric,
	"peak_propulsive_power_w" numeric,
	"avg_propulsive_velocity_m_s" numeric,
	"propulsive_impulse_n_s" numeric,
	"p1_propulsive_impulse_n_s" numeric,
	"p2_propulsive_impulse_n_s" numeric,
	"p1p2_propulsive_impulse_index" numeric,
	"attempt_key" text
);
--> statement-breakpoint
CREATE TABLE "hawkins_drop_jump" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"external_unique_id" text NOT NULL,
	"athlete_id" text NOT NULL,
	"athlete_name" text,
	"test_type_name" text NOT NULL,
	"test_type_canonical_id" text NOT NULL,
	"raw_data" jsonb NOT NULL,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"mrsi" numeric,
	"attempt_key" text
);
--> statement-breakpoint
CREATE TABLE "hawkins_iso" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"external_unique_id" text NOT NULL,
	"athlete_id" text NOT NULL,
	"athlete_name" text,
	"test_type_name" text NOT NULL,
	"test_type_canonical_id" text NOT NULL,
	"raw_data" jsonb NOT NULL,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"length_of_pull_s" numeric,
	"time_to_peak_force_s" numeric,
	"peak_force_n" numeric,
	"attempt_key" text
);
--> statement-breakpoint
CREATE TABLE "hawkins_multi" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"external_unique_id" text NOT NULL,
	"athlete_id" text NOT NULL,
	"athlete_name" text,
	"test_type_name" text NOT NULL,
	"test_type_canonical_id" text NOT NULL,
	"raw_data" jsonb NOT NULL,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"avg_mrsi" numeric,
	"attempt_key" text
);
--> statement-breakpoint
CREATE TABLE "hawkins_ts_iso" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"external_unique_id" text NOT NULL,
	"athlete_id" text NOT NULL,
	"athlete_name" text,
	"test_type_name" text NOT NULL,
	"test_type_canonical_id" text NOT NULL,
	"raw_data" jsonb NOT NULL,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"peak_force_n" numeric,
	"attempt_key" text
);
--> statement-breakpoint
CREATE TABLE "lesson_mechanics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"mechanic_id" uuid NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "mechanics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(1000),
	"type" "mechanic_type" NOT NULL,
	"tags" varchar(255)[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "pitching_lesson_players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_player_id" uuid NOT NULL,
	"phase" text NOT NULL,
	"pitch_count" integer,
	"intent_percent" integer
);
--> statement-breakpoint
CREATE TABLE "athlete_cohorts" (
	"athlete_id" uuid NOT NULL,
	"cohort_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cohort_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "athlete_context_flags" (
	"athlete_id" uuid NOT NULL,
	"context_type" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "athlete_metric_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"athlete_id" uuid NOT NULL,
	"metric_id" uuid NOT NULL,
	"raw_value" real NOT NULL,
	"normalized_value" real,
	"recorded_at" date NOT NULL,
	"source_table" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "metric_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"system" text NOT NULL,
	"metric_key" text NOT NULL,
	"display_name" text NOT NULL,
	"unit" text,
	"higher_is_better" boolean DEFAULT true NOT NULL,
	"category" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cohort_metric_stats" (
	"cohort_id" uuid NOT NULL,
	"metric_id" uuid NOT NULL,
	"p10" real,
	"p25" real,
	"p50" real,
	"p75" real,
	"p90" real,
	"mean" real,
	"stddev" real,
	"calculated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "computed_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"athlete_id" uuid NOT NULL,
	"score_type" text NOT NULL,
	"score_value" real NOT NULL,
	"version" text NOT NULL,
	"calculated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "metric_weights" (
	"metric_id" uuid NOT NULL,
	"score_type" text NOT NULL,
	"weight" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "athlete_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"athlete_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"event_date" date NOT NULL,
	"label" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "metric_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"metric_id" uuid NOT NULL,
	"system" text NOT NULL,
	"source_table" text NOT NULL,
	"source_field" text NOT NULL,
	"reliability" real,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player_positions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"position_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "positions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"group" text NOT NULL,
	"is_resolvable" boolean DEFAULT true NOT NULL,
	CONSTRAINT "positions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "manual_ts_iso" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_player_id" uuid NOT NULL,
	"shoulder_er_l" real,
	"shoulder_er_r" real,
	"shoulder_er_ttpf_l" real,
	"shoulder_er_ttpf_r" real,
	"shoulder_ir_l" real,
	"shoulder_ir_r" real,
	"shoulder_ir_ttpf_l" real,
	"shoulder_ir_ttpf_r" real,
	"shoulder_rot_l" real,
	"shoulder_rot_r" real,
	"shoulder_rot_rfd_l" real,
	"shoulder_rot_rfd_r" real,
	"hip_rot_l" real,
	"hip_rot_r" real,
	"hip_rot_rfd_l" real,
	"hip_rot_rfd_r" real,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "player_information" ADD CONSTRAINT "player_information_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_coachId_user_id_fk" FOREIGN KEY ("coachId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arm_care" ADD CONSTRAINT "arm_care_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hawkins_force_plate" ADD CONSTRAINT "hawkins_force_plate_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "smfa" ADD CONSTRAINT "smfa_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "true_strength" ADD CONSTRAINT "true_strength_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "smfa_boolean" ADD CONSTRAINT "smfa_boolean_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_coach_id_user_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_measurements" ADD CONSTRAINT "player_measurements_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fielding_assessment" ADD CONSTRAINT "fielding_assessment_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catching_assessment" ADD CONSTRAINT "catching_assessment_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "writeups" ADD CONSTRAINT "writeups_coach_id_user_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "writeups" ADD CONSTRAINT "writeups_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_injuries" ADD CONSTRAINT "player_injuries_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hittrax_assessment" ADD CONSTRAINT "hittrax_assessment_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "motor_preferences" ADD CONSTRAINT "motor_preferences_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_assessments" ADD CONSTRAINT "lesson_assessments_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pitching_assessment" ADD CONSTRAINT "pitching_assessment_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hitting_assessment" ADD CONSTRAINT "hitting_assessment_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "armcare_exams" ADD CONSTRAINT "armcare_exams_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "armcare_exams" ADD CONSTRAINT "armcare_exams_sync_log_id_external_sync_logs_id_fk" FOREIGN KEY ("sync_log_id") REFERENCES "public"."external_sync_logs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_sync_logs" ADD CONSTRAINT "external_sync_logs_triggered_by_user_id_user_id_fk" FOREIGN KEY ("triggered_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "armcare_exams_unmatched" ADD CONSTRAINT "armcare_exams_unmatched_sync_log_id_external_sync_logs_id_fk" FOREIGN KEY ("sync_log_id") REFERENCES "public"."external_sync_logs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "armcare_exams_unmatched" ADD CONSTRAINT "armcare_exams_unmatched_resolved_by_user_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_athlete_ids" ADD CONSTRAINT "external_athlete_ids_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_athlete_ids" ADD CONSTRAINT "external_athlete_ids_linked_by_user_id_fk" FOREIGN KEY ("linked_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "velo_assessment" ADD CONSTRAINT "velo_assessment_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "writeup_log" ADD CONSTRAINT "writeup_log_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "writeup_log" ADD CONSTRAINT "writeup_log_coach_id_user_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_mechanics" ADD CONSTRAINT "lesson_mechanics_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_mechanics" ADD CONSTRAINT "lesson_mechanics_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_mechanics" ADD CONSTRAINT "lesson_mechanics_mechanic_id_mechanics_id_fk" FOREIGN KEY ("mechanic_id") REFERENCES "public"."mechanics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_players" ADD CONSTRAINT "lesson_players_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_players" ADD CONSTRAINT "lesson_players_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pitching_lesson_players" ADD CONSTRAINT "pitching_lesson_players_lesson_player_id_lesson_players_id_fk" FOREIGN KEY ("lesson_player_id") REFERENCES "public"."lesson_players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_cohorts" ADD CONSTRAINT "athlete_cohorts_athlete_id_player_information_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_cohorts" ADD CONSTRAINT "athlete_cohorts_cohort_id_cohort_definitions_id_fk" FOREIGN KEY ("cohort_id") REFERENCES "public"."cohort_definitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_context_flags" ADD CONSTRAINT "athlete_context_flags_athlete_id_player_information_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_metric_snapshots" ADD CONSTRAINT "athlete_metric_snapshots_athlete_id_player_information_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_metric_snapshots" ADD CONSTRAINT "athlete_metric_snapshots_metric_id_metric_definitions_id_fk" FOREIGN KEY ("metric_id") REFERENCES "public"."metric_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cohort_metric_stats" ADD CONSTRAINT "cohort_metric_stats_cohort_id_cohort_definitions_id_fk" FOREIGN KEY ("cohort_id") REFERENCES "public"."cohort_definitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cohort_metric_stats" ADD CONSTRAINT "cohort_metric_stats_metric_id_metric_definitions_id_fk" FOREIGN KEY ("metric_id") REFERENCES "public"."metric_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "computed_scores" ADD CONSTRAINT "computed_scores_athlete_id_player_information_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric_weights" ADD CONSTRAINT "metric_weights_metric_id_metric_definitions_id_fk" FOREIGN KEY ("metric_id") REFERENCES "public"."metric_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_events" ADD CONSTRAINT "athlete_events_athlete_id_player_information_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric_sources" ADD CONSTRAINT "metric_sources_metric_id_metric_definitions_id_fk" FOREIGN KEY ("metric_id") REFERENCES "public"."metric_definitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_positions" ADD CONSTRAINT "player_positions_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_positions" ADD CONSTRAINT "player_positions_position_id_positions_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."positions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manual_ts_iso" ADD CONSTRAINT "manual_ts_iso_lesson_player_id_lesson_players_id_fk" FOREIGN KEY ("lesson_player_id") REFERENCES "public"."lesson_players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "arm_care_coach_idx" ON "arm_care" USING btree ("coach_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "arm_care_lesson_idx" ON "arm_care" USING btree ("lesson_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "arm_care_player_idx" ON "arm_care" USING btree ("player_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "hawkins_force_plate_lesson_idx" ON "hawkins_force_plate" USING btree ("lesson_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "smfa_coach_idx" ON "smfa" USING btree ("coach_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "smfa_lesson_idx" ON "smfa" USING btree ("lesson_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "smfa_player_idx" ON "smfa" USING btree ("player_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "true_strength_coach_idx" ON "true_strength" USING btree ("coach_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "true_strength_lesson_idx" ON "true_strength" USING btree ("lesson_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "true_strength_user_idx" ON "true_strength" USING btree ("player_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "smfa_boolean_coach_idx" ON "smfa_boolean" USING btree ("coach_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "smfa_boolean_lesson_idx" ON "smfa_boolean" USING btree ("lesson_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "smfa_boolean_player_idx" ON "smfa_boolean" USING btree ("player_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "lesson_coach_idx" ON "lesson" USING btree ("coach_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "lesson_date_idx" ON "lesson" USING btree ("lesson_date" timestamp_ops);--> statement-breakpoint
CREATE INDEX "lesson_player_idx" ON "lesson" USING btree ("player_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "lesson_type_idx" ON "lesson" USING btree ("lesson_type" enum_ops);--> statement-breakpoint
CREATE INDEX "fielding_assessment_lesson_idx" ON "fielding_assessment" USING btree ("lesson_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "catching_assessment_lesson_idx" ON "catching_assessment" USING btree ("lesson_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "hittrax_assessment_lesson_idx" ON "hittrax_assessment" USING btree ("lesson_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "lesson_assessments_lesson_idx" ON "lesson_assessments" USING btree ("lesson_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "lesson_assessments_type_idx" ON "lesson_assessments" USING btree ("assessment_type" enum_ops);--> statement-breakpoint
CREATE INDEX "lesson_assessments_unique_idx" ON "lesson_assessments" USING btree ("assessment_type" enum_ops,"assessment_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "pitching_assessment_lesson_idx" ON "pitching_assessment" USING btree ("lesson_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "hitting_assessment_lesson_idx" ON "hitting_assessment" USING btree ("lesson_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "armcare_exams_date_idx" ON "armcare_exams" USING btree ("exam_date" date_ops);--> statement-breakpoint
CREATE INDEX "armcare_exams_player_idx" ON "armcare_exams" USING btree ("player_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "sync_logs_system_idx" ON "external_sync_logs" USING btree ("system" enum_ops);--> statement-breakpoint
CREATE INDEX "armcare_exams_unmatched_player_idx" ON "armcare_exams_unmatched" USING btree ("external_player_id" text_ops);--> statement-breakpoint
CREATE INDEX "armcare_exams_unmatched_status_idx" ON "armcare_exams_unmatched" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "external_athlete_ids_player_idx" ON "external_athlete_ids" USING btree ("player_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "external_athlete_ids_unique_idx" ON "external_athlete_ids" USING btree ("external_system" text_ops,"external_id" text_ops);--> statement-breakpoint
CREATE INDEX "velo_assessment_lesson_idx" ON "velo_assessment" USING btree ("lesson_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "writeup_log_coach_id_idx" ON "writeup_log" USING btree ("coach_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "writeup_log_date_idx" ON "writeup_log" USING btree ("writeup_date" date_ops);--> statement-breakpoint
CREATE INDEX "writeup_log_player_id_idx" ON "writeup_log" USING btree ("player_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "allowed_users_org_provider_email_uniq" ON "allowed_users" USING btree ("organization_id" text_ops,"provider" text_ops,"email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "hawkins_cmj_unique_attempt" ON "hawkins_cmj" USING btree ("athlete_id" text_ops,"timestamp" text_ops,"attempt_key" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "hawkins_drop_jump_unique_attempt" ON "hawkins_drop_jump" USING btree ("athlete_id" text_ops,"timestamp" text_ops,"attempt_key" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "hawkins_iso_unique_attempt" ON "hawkins_iso" USING btree ("athlete_id" text_ops,"timestamp" text_ops,"attempt_key" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "hawkins_multi_unique_attempt" ON "hawkins_multi" USING btree ("athlete_id" text_ops,"timestamp" text_ops,"attempt_key" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "hawkins_ts_iso_unique_attempt" ON "hawkins_ts_iso" USING btree ("athlete_id" text_ops,"timestamp" text_ops,"attempt_key" text_ops);--> statement-breakpoint
CREATE INDEX "lesson_mechanics_lesson_idx" ON "lesson_mechanics" USING btree ("lesson_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "lesson_mechanics_mechanic_idx" ON "lesson_mechanics" USING btree ("mechanic_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "lesson_mechanics_player_idx" ON "lesson_mechanics" USING btree ("player_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "lesson_players_lesson_idx" ON "lesson_players" USING btree ("lesson_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "lesson_players_player_idx" ON "lesson_players" USING btree ("player_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "pitching_lesson_players_lp_idx" ON "pitching_lesson_players" USING btree ("lesson_player_id" uuid_ops);
*/