CREATE TYPE "public"."development_plan_item_type" AS ENUM('short_term_goal', 'long_term_goal', 'focus_area', 'measurable_indicator');--> statement-breakpoint
CREATE TYPE "public"."routine_assignment_status" AS ENUM('active', 'paused', 'completed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."routine_assignment_type" AS ENUM('pre_lesson', 'full_lesson', 'homework', 'recovery', 'checkpoint');--> statement-breakpoint
CREATE TYPE "public"."routine_type" AS ENUM('partial_lesson', 'full_lesson', 'progression');--> statement-breakpoint
CREATE TYPE "public"."development_plan_status" AS ENUM('draft', 'active', 'completed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."evaluation_bucket_status" AS ENUM('strength', 'developing', 'constraint', 'not_relevant');--> statement-breakpoint
CREATE TYPE "public"."athlete_phase" AS ENUM('offseason', 'preseason', 'inseason', 'postseason', 'rehab', 'return_to_play', 'general');--> statement-breakpoint
CREATE TYPE "public"."evaluation_type" AS ENUM('baseline', 'monthly', 'season_review', 'injury_return', 'general');--> statement-breakpoint
CREATE TYPE "public"."routine_item_type" AS ENUM('drill', 'instruction', 'checkpoint', 'recovery', 'assessment', 'block');--> statement-breakpoint
CREATE TABLE "development_plan_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"development_plan_id" uuid NOT NULL,
	"type" "development_plan_item_type" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	CONSTRAINT "development_plan_items_sort_order_check" CHECK ("development_plan_items"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "development_plan_routine_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"development_plan_id" uuid NOT NULL,
	"routine_id" uuid NOT NULL,
	"assignment_type" "routine_assignment_type" NOT NULL,
	"status" "routine_assignment_status" DEFAULT 'active' NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"current_stage_id" uuid,
	"assigned_by" uuid NOT NULL,
	"assigned_on" timestamp DEFAULT now() NOT NULL,
	"started_on" timestamp,
	"last_progressed_on" timestamp,
	"completed_on" timestamp,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "development_plan_routine_focus_areas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"routine_id" uuid NOT NULL,
	"development_plan_item_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "development_plan_routine_mechanics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"routine_id" uuid NOT NULL,
	"mechanic_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "development_plan_routine_progress_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assignment_id" uuid NOT NULL,
	"from_stage_id" uuid,
	"to_stage_id" uuid NOT NULL,
	"changed_by" uuid NOT NULL,
	"changed_on" timestamp DEFAULT now() NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "development_plan_routines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"development_plan_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"routine_type" "routine_type" NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" uuid NOT NULL,
	"created_on" timestamp DEFAULT now() NOT NULL,
	"updated_on" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "development_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"discipline_id" uuid NOT NULL,
	"evaluation_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"status" "development_plan_status" DEFAULT 'draft' NOT NULL,
	"start_date" timestamp,
	"target_end_date" timestamp,
	"created_on" timestamp DEFAULT now() NOT NULL,
	"updated_on" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evaluation_buckets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"evaluation_id" uuid NOT NULL,
	"bucket_id" uuid NOT NULL,
	"status" "evaluation_bucket_status" NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "evaluation_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"evaluation_id" uuid NOT NULL,
	"performance_session_id" uuid NOT NULL,
	"notes" text,
	"created_on" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evaluation_focus_areas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"evaluation_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "evaluation_focus_areas_sort_order_check" CHECK ("evaluation_focus_areas"."sort_order" >= 0)
);
--> statement-breakpoint
CREATE TABLE "evaluations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"discipline_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"evaluation_date" timestamp NOT NULL,
	"evaluation_type" "evaluation_type" NOT NULL,
	"phase" "athlete_phase" DEFAULT 'general' NOT NULL,
	"injury_considerations" text,
	"snapshot_summary" text NOT NULL,
	"strength_profile_summary" text NOT NULL,
	"key_constraints_summary" text NOT NULL,
	"created_on" timestamp DEFAULT now() NOT NULL,
	"updated_on" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "routine_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"routine_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"item_type" "routine_item_type" NOT NULL,
	"drill_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"target_value" text,
	"target_unit" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "routine_progression_stage_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"progression_stage_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"item_type" "routine_item_type" NOT NULL,
	"drill_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"target_value" text,
	"target_unit" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "routine_progression_stages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"routine_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"stage_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "development_plan_items" ADD CONSTRAINT "development_plan_items_development_plan_id_development_plans_id_fk" FOREIGN KEY ("development_plan_id") REFERENCES "public"."development_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plan_routine_assignments" ADD CONSTRAINT "development_plan_routine_assignments_development_plan_id_development_plans_id_fk" FOREIGN KEY ("development_plan_id") REFERENCES "public"."development_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plan_routine_assignments" ADD CONSTRAINT "development_plan_routine_assignments_routine_id_development_plan_routines_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."development_plan_routines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plan_routine_assignments" ADD CONSTRAINT "development_plan_routine_assignments_current_stage_id_routine_progression_stages_id_fk" FOREIGN KEY ("current_stage_id") REFERENCES "public"."routine_progression_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plan_routine_assignments" ADD CONSTRAINT "development_plan_routine_assignments_assigned_by_user_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plan_routine_focus_areas" ADD CONSTRAINT "development_plan_routine_focus_areas_routine_id_development_plan_routines_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."development_plan_routines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plan_routine_focus_areas" ADD CONSTRAINT "development_plan_routine_focus_areas_development_plan_item_id_development_plan_items_id_fk" FOREIGN KEY ("development_plan_item_id") REFERENCES "public"."development_plan_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plan_routine_mechanics" ADD CONSTRAINT "development_plan_routine_mechanics_routine_id_development_plan_routines_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."development_plan_routines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plan_routine_mechanics" ADD CONSTRAINT "development_plan_routine_mechanics_mechanic_id_mechanics_id_fk" FOREIGN KEY ("mechanic_id") REFERENCES "public"."mechanics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plan_routine_progress_log" ADD CONSTRAINT "development_plan_routine_progress_log_assignment_id_development_plan_routine_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."development_plan_routine_assignments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plan_routine_progress_log" ADD CONSTRAINT "development_plan_routine_progress_log_from_stage_id_routine_progression_stages_id_fk" FOREIGN KEY ("from_stage_id") REFERENCES "public"."routine_progression_stages"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plan_routine_progress_log" ADD CONSTRAINT "development_plan_routine_progress_log_to_stage_id_routine_progression_stages_id_fk" FOREIGN KEY ("to_stage_id") REFERENCES "public"."routine_progression_stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plan_routine_progress_log" ADD CONSTRAINT "development_plan_routine_progress_log_changed_by_user_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plan_routines" ADD CONSTRAINT "development_plan_routines_development_plan_id_development_plans_id_fk" FOREIGN KEY ("development_plan_id") REFERENCES "public"."development_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plan_routines" ADD CONSTRAINT "development_plan_routines_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plans" ADD CONSTRAINT "development_plans_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plans" ADD CONSTRAINT "development_plans_discipline_id_disciplines_id_fk" FOREIGN KEY ("discipline_id") REFERENCES "public"."disciplines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plans" ADD CONSTRAINT "development_plans_evaluation_id_evaluations_id_fk" FOREIGN KEY ("evaluation_id") REFERENCES "public"."evaluations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plans" ADD CONSTRAINT "development_plans_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_buckets" ADD CONSTRAINT "evaluation_buckets_evaluation_id_evaluations_id_fk" FOREIGN KEY ("evaluation_id") REFERENCES "public"."evaluations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_buckets" ADD CONSTRAINT "evaluation_buckets_bucket_id_buckets_id_fk" FOREIGN KEY ("bucket_id") REFERENCES "public"."buckets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_evidence" ADD CONSTRAINT "evaluation_evidence_evaluation_id_evaluations_id_fk" FOREIGN KEY ("evaluation_id") REFERENCES "public"."evaluations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_evidence" ADD CONSTRAINT "evaluation_evidence_performance_session_id_performance_session_id_fk" FOREIGN KEY ("performance_session_id") REFERENCES "public"."performance_session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_focus_areas" ADD CONSTRAINT "evaluation_focus_areas_evaluation_id_evaluations_id_fk" FOREIGN KEY ("evaluation_id") REFERENCES "public"."evaluations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_discipline_id_disciplines_id_fk" FOREIGN KEY ("discipline_id") REFERENCES "public"."disciplines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_items" ADD CONSTRAINT "routine_items_routine_id_development_plan_routines_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."development_plan_routines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_items" ADD CONSTRAINT "routine_items_drill_id_drills_id_fk" FOREIGN KEY ("drill_id") REFERENCES "public"."drills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_progression_stage_items" ADD CONSTRAINT "routine_progression_stage_items_progression_stage_id_routine_progression_stage_items_id_fk" FOREIGN KEY ("progression_stage_id") REFERENCES "public"."routine_progression_stage_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_progression_stage_items" ADD CONSTRAINT "routine_progression_stage_items_drill_id_drills_id_fk" FOREIGN KEY ("drill_id") REFERENCES "public"."drills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_progression_stages" ADD CONSTRAINT "routine_progression_stages_routine_id_development_plan_routines_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."development_plan_routines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "development_plan_items_plan_idx" ON "development_plan_items" USING btree ("development_plan_id");--> statement-breakpoint
CREATE INDEX "development_plan_items_type_idx" ON "development_plan_items" USING btree ("type");--> statement-breakpoint
CREATE INDEX "development_plan_routine_assignments_plan_idx" ON "development_plan_routine_assignments" USING btree ("development_plan_id");--> statement-breakpoint
CREATE INDEX "development_plan_routine_assignments_routine_idx" ON "development_plan_routine_assignments" USING btree ("routine_id");--> statement-breakpoint
CREATE INDEX "development_plan_routine_assignments_type_idx" ON "development_plan_routine_assignments" USING btree ("assignment_type");--> statement-breakpoint
CREATE INDEX "development_plan_routine_assignments_status_idx" ON "development_plan_routine_assignments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "development_plan_routine_focus_areas_routine_idx" ON "development_plan_routine_focus_areas" USING btree ("routine_id");--> statement-breakpoint
CREATE INDEX "development_plan_routine_focus_areas_item_idx" ON "development_plan_routine_focus_areas" USING btree ("development_plan_item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "development_plan_routine_focus_areas_uidx" ON "development_plan_routine_focus_areas" USING btree ("routine_id","development_plan_item_id");--> statement-breakpoint
CREATE INDEX "development_plan_routine_mechanics_routine_idx" ON "development_plan_routine_mechanics" USING btree ("routine_id");--> statement-breakpoint
CREATE INDEX "development_plan_routine_mechanics_mechanic_idx" ON "development_plan_routine_mechanics" USING btree ("mechanic_id");--> statement-breakpoint
CREATE UNIQUE INDEX "development_plan_routine_mechanics_uidx" ON "development_plan_routine_mechanics" USING btree ("routine_id","mechanic_id");--> statement-breakpoint
CREATE INDEX "development_plan_routine_progress_log_assignment_idx" ON "development_plan_routine_progress_log" USING btree ("assignment_id");--> statement-breakpoint
CREATE INDEX "development_plan_routines_plan_idx" ON "development_plan_routines" USING btree ("development_plan_id");--> statement-breakpoint
CREATE INDEX "development_plan_routines_type_idx" ON "development_plan_routines" USING btree ("routine_type");--> statement-breakpoint
CREATE INDEX "development_plans_player_idx" ON "development_plans" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "development_plans_discipline_idx" ON "development_plans" USING btree ("discipline_id");--> statement-breakpoint
CREATE INDEX "development_plans_evaluation_idx" ON "development_plans" USING btree ("evaluation_id");--> statement-breakpoint
CREATE INDEX "development_plans_status_idx" ON "development_plans" USING btree ("status");--> statement-breakpoint
CREATE INDEX "evaluation_buckets_evaluation_idx" ON "evaluation_buckets" USING btree ("evaluation_id");--> statement-breakpoint
CREATE UNIQUE INDEX "evaluation_buckets_eval_bucket_uidx" ON "evaluation_buckets" USING btree ("evaluation_id","bucket_id");--> statement-breakpoint
CREATE INDEX "evaluation_evidence_evaluation_idx" ON "evaluation_evidence" USING btree ("evaluation_id");--> statement-breakpoint
CREATE UNIQUE INDEX "evaluation_evidence_eval_perf_uidx" ON "evaluation_evidence" USING btree ("evaluation_id","performance_session_id");--> statement-breakpoint
CREATE INDEX "evaluation_focus_areas_evaluation_idx" ON "evaluation_focus_areas" USING btree ("evaluation_id");--> statement-breakpoint
CREATE INDEX "evaluations_player_idx" ON "evaluations" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "evaluations_discipline_idx" ON "evaluations" USING btree ("discipline_id");--> statement-breakpoint
CREATE INDEX "evaluations_eval_date_idx" ON "evaluations" USING btree ("evaluation_date");--> statement-breakpoint
CREATE INDEX "routine_items_routine_idx" ON "routine_items" USING btree ("routine_id");--> statement-breakpoint
CREATE INDEX "routine_items_drill_idx" ON "routine_items" USING btree ("drill_id");--> statement-breakpoint
CREATE INDEX "routine_progression_stage_items_stage_idx" ON "routine_progression_stage_items" USING btree ("progression_stage_id");--> statement-breakpoint
CREATE INDEX "routine_progression_stage_items_drill_idx" ON "routine_progression_stage_items" USING btree ("drill_id");--> statement-breakpoint
CREATE INDEX "routine_progression_stages_routine_idx" ON "routine_progression_stages" USING btree ("routine_id");