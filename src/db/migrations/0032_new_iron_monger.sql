CREATE TYPE "public"."external_system" AS ENUM('armcare', 'trackman', 'hittrax', 'hawkin');--> statement-breakpoint
CREATE TYPE "public"."linking_method" AS ENUM('email_match', 'phone', 'manual', 'name_match');--> statement-breakpoint
CREATE TYPE "public"."linking_status" AS ENUM('active', 'pending', 'inactive', 'failed');--> statement-breakpoint
CREATE TYPE "public"."sync_status" AS ENUM('running', 'success', 'partial_success', 'failed');--> statement-breakpoint
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
	"triggered_by_user_id" uuid,
	CONSTRAINT "external_sync_logs_system_unique" UNIQUE("system")
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
ALTER TABLE "armcare_exams" ADD CONSTRAINT "armcare_exams_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "armcare_exams" ADD CONSTRAINT "armcare_exams_sync_log_id_external_sync_logs_id_fk" FOREIGN KEY ("sync_log_id") REFERENCES "public"."external_sync_logs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "armcare_exams_unmatched" ADD CONSTRAINT "armcare_exams_unmatched_sync_log_id_external_sync_logs_id_fk" FOREIGN KEY ("sync_log_id") REFERENCES "public"."external_sync_logs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "armcare_exams_unmatched" ADD CONSTRAINT "armcare_exams_unmatched_resolved_by_user_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_athlete_ids" ADD CONSTRAINT "external_athlete_ids_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_athlete_ids" ADD CONSTRAINT "external_athlete_ids_linked_by_user_id_fk" FOREIGN KEY ("linked_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_sync_logs" ADD CONSTRAINT "external_sync_logs_triggered_by_user_id_user_id_fk" FOREIGN KEY ("triggered_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "armcare_exams_player_idx" ON "armcare_exams" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "armcare_exams_date_idx" ON "armcare_exams" USING btree ("exam_date");--> statement-breakpoint
CREATE INDEX "armcare_exams_unmatched_player_idx" ON "armcare_exams_unmatched" USING btree ("external_player_id");--> statement-breakpoint
CREATE INDEX "armcare_exams_unmatched_status_idx" ON "armcare_exams_unmatched" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "external_athlete_ids_unique_idx" ON "external_athlete_ids" USING btree ("external_system","external_id");--> statement-breakpoint
CREATE INDEX "external_athlete_ids_player_idx" ON "external_athlete_ids" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "sync_logs_system_idx" ON "external_sync_logs" USING btree ("system");