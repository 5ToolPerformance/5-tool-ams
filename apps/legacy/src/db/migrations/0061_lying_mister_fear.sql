CREATE TYPE "public"."player_coach_role" AS ENUM('primary', 'secondary');--> statement-breakpoint
CREATE TYPE "public"."development_goal_status" AS ENUM('active', 'achieved', 'dropped');--> statement-breakpoint
CREATE TYPE "public"."development_goal_type" AS ENUM('short_term', 'long_term');--> statement-breakpoint
CREATE TYPE "public"."development_plan_priority" AS ENUM('high', 'medium', 'low');--> statement-breakpoint
CREATE TYPE "public"."development_plan_status" AS ENUM('active', 'completed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."evaluation_bucket_status" AS ENUM('strength', 'developing', 'constraint', 'not_relevant');--> statement-breakpoint
CREATE TYPE "public"."evaluation_type" AS ENUM('baseline', 'monthly', 'season_review', 'injury_return');--> statement-breakpoint
CREATE TYPE "public"."lesson_player_block_item_type" AS ENUM('drill', 'mechanic', 'cue', 'constraint', 'measurement', 'media');--> statement-breakpoint
CREATE TYPE "public"."routine_block_item_type" AS ENUM('drill', 'mechanic', 'cue', 'constraint', 'measurement', 'media');--> statement-breakpoint
CREATE TYPE "public"."routine_context" AS ENUM('block', 'full_lesson');--> statement-breakpoint
CREATE TYPE "public"."routine_visibility" AS ENUM('library', 'player');--> statement-breakpoint
CREATE TABLE "player_coaches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"coach_id" uuid NOT NULL,
	"role" "player_coach_role" NOT NULL,
	"created_on" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "buckets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"discipline_id" uuid NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"description" text,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "disciplines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "disciplines_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "development_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"goal_type" "development_goal_type" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"target_date" timestamp,
	"status" "development_goal_status" DEFAULT 'active' NOT NULL,
	"created_on" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "development_plan_buckets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"bucket_id" uuid NOT NULL,
	"priority" "development_plan_priority" NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "development_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"evaluation_id" uuid,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"status" "development_plan_status" DEFAULT 'active' NOT NULL,
	"notes" text,
	"created_on" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evaluation_assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"evaluation_id" uuid NOT NULL,
	"performance_session_id" uuid NOT NULL,
	"notes" text,
	"created_on" timestamp DEFAULT now() NOT NULL
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
CREATE TABLE "evaluations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"evaluation_date" timestamp NOT NULL,
	"evaluation_type" "evaluation_type" NOT NULL,
	"notes" text,
	"created_on" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_block_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"discipline_id" uuid NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"description" text,
	"active" boolean DEFAULT true NOT NULL,
	"default_sort_order" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "lesson_player_block_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_player_block_id" uuid NOT NULL,
	"item_type" "lesson_player_block_item_type" NOT NULL,
	"sort_order" integer NOT NULL,
	"drill_id" uuid,
	"mechanic_id" uuid,
	"text" text,
	"sets" integer,
	"reps" integer,
	"seconds" integer,
	"intensity" text,
	"params" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_player_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_player_id" uuid NOT NULL,
	"block_type_id" uuid NOT NULL,
	"sort_order" integer NOT NULL,
	"goal" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "development_plan_routines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"routine_id" uuid NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "routine_block_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"routine_block_id" uuid NOT NULL,
	"item_type" "routine_block_item_type" NOT NULL,
	"sort_order" integer NOT NULL,
	"drill_id" uuid,
	"mechanic_id" uuid,
	"text" text,
	"sets" integer,
	"reps" integer,
	"seconds" integer,
	"intensity" text,
	"params" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "routine_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"routine_id" uuid NOT NULL,
	"block_type_id" uuid NOT NULL,
	"sort_order" integer NOT NULL,
	"goal" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "routines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"discipline_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"player_id" uuid,
	"visibility" "routine_visibility" DEFAULT 'library' NOT NULL,
	"context" "routine_context" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "player_coaches" ADD CONSTRAINT "player_coaches_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_coaches" ADD CONSTRAINT "player_coaches_coach_id_user_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "buckets" ADD CONSTRAINT "buckets_discipline_id_disciplines_id_fk" FOREIGN KEY ("discipline_id") REFERENCES "public"."disciplines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_goals" ADD CONSTRAINT "development_goals_plan_id_development_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."development_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plan_buckets" ADD CONSTRAINT "development_plan_buckets_plan_id_development_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."development_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plan_buckets" ADD CONSTRAINT "development_plan_buckets_bucket_id_buckets_id_fk" FOREIGN KEY ("bucket_id") REFERENCES "public"."buckets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plans" ADD CONSTRAINT "development_plans_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plans" ADD CONSTRAINT "development_plans_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plans" ADD CONSTRAINT "development_plans_evaluation_id_evaluations_id_fk" FOREIGN KEY ("evaluation_id") REFERENCES "public"."evaluations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_assessments" ADD CONSTRAINT "evaluation_assessments_evaluation_id_evaluations_id_fk" FOREIGN KEY ("evaluation_id") REFERENCES "public"."evaluations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_assessments" ADD CONSTRAINT "evaluation_assessments_performance_session_id_performance_session_id_fk" FOREIGN KEY ("performance_session_id") REFERENCES "public"."performance_session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_buckets" ADD CONSTRAINT "evaluation_buckets_evaluation_id_evaluations_id_fk" FOREIGN KEY ("evaluation_id") REFERENCES "public"."evaluations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_buckets" ADD CONSTRAINT "evaluation_buckets_bucket_id_buckets_id_fk" FOREIGN KEY ("bucket_id") REFERENCES "public"."buckets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_block_types" ADD CONSTRAINT "lesson_block_types_discipline_id_disciplines_id_fk" FOREIGN KEY ("discipline_id") REFERENCES "public"."disciplines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_player_block_items" ADD CONSTRAINT "lesson_player_block_items_lesson_player_block_id_lesson_player_blocks_id_fk" FOREIGN KEY ("lesson_player_block_id") REFERENCES "public"."lesson_player_blocks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_player_block_items" ADD CONSTRAINT "lesson_player_block_items_drill_id_drills_id_fk" FOREIGN KEY ("drill_id") REFERENCES "public"."drills"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_player_block_items" ADD CONSTRAINT "lesson_player_block_items_mechanic_id_mechanics_id_fk" FOREIGN KEY ("mechanic_id") REFERENCES "public"."mechanics"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_player_blocks" ADD CONSTRAINT "lesson_player_blocks_lesson_player_id_lesson_players_id_fk" FOREIGN KEY ("lesson_player_id") REFERENCES "public"."lesson_players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_player_blocks" ADD CONSTRAINT "lesson_player_blocks_block_type_id_lesson_block_types_id_fk" FOREIGN KEY ("block_type_id") REFERENCES "public"."lesson_block_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plan_routines" ADD CONSTRAINT "development_plan_routines_plan_id_development_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."development_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plan_routines" ADD CONSTRAINT "development_plan_routines_routine_id_routines_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."routines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_block_items" ADD CONSTRAINT "routine_block_items_routine_block_id_routine_blocks_id_fk" FOREIGN KEY ("routine_block_id") REFERENCES "public"."routine_blocks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_block_items" ADD CONSTRAINT "routine_block_items_drill_id_drills_id_fk" FOREIGN KEY ("drill_id") REFERENCES "public"."drills"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_block_items" ADD CONSTRAINT "routine_block_items_mechanic_id_mechanics_id_fk" FOREIGN KEY ("mechanic_id") REFERENCES "public"."mechanics"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_blocks" ADD CONSTRAINT "routine_blocks_routine_id_routines_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."routines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routine_blocks" ADD CONSTRAINT "routine_blocks_block_type_id_lesson_block_types_id_fk" FOREIGN KEY ("block_type_id") REFERENCES "public"."lesson_block_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routines" ADD CONSTRAINT "routines_discipline_id_disciplines_id_fk" FOREIGN KEY ("discipline_id") REFERENCES "public"."disciplines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routines" ADD CONSTRAINT "routines_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routines" ADD CONSTRAINT "routines_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "player_coaches_player_idx" ON "player_coaches" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "player_coaches_coach_idx" ON "player_coaches" USING btree ("coach_id");--> statement-breakpoint
CREATE UNIQUE INDEX "buckets_discipline_key_unique" ON "buckets" USING btree ("discipline_id","key");--> statement-breakpoint
CREATE INDEX "development_goal_plan_idx" ON "development_goals" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "development_plan_bucket_idx" ON "development_plan_buckets" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "development_plan_player_idx" ON "development_plans" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "evaluation_assessment_eval_idx" ON "evaluation_assessments" USING btree ("evaluation_id");--> statement-breakpoint
CREATE INDEX "evaluation_bucket_eval_idx" ON "evaluation_buckets" USING btree ("evaluation_id");--> statement-breakpoint
CREATE INDEX "evaluations_player_idx" ON "evaluations" USING btree ("player_id");--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_block_types_discipline_key_unique" ON "lesson_block_types" USING btree ("discipline_id","key");--> statement-breakpoint
CREATE INDEX "lesson_block_types_discipline_idx" ON "lesson_block_types" USING btree ("discipline_id");--> statement-breakpoint
CREATE INDEX "lesson_block_types_active_idx" ON "lesson_block_types" USING btree ("active");--> statement-breakpoint
CREATE INDEX "lesson_player_block_items_block_idx" ON "lesson_player_block_items" USING btree ("lesson_player_block_id");--> statement-breakpoint
CREATE INDEX "lesson_player_block_items_block_sort_idx" ON "lesson_player_block_items" USING btree ("lesson_player_block_id","sort_order");--> statement-breakpoint
CREATE INDEX "lesson_player_block_items_type_idx" ON "lesson_player_block_items" USING btree ("item_type");--> statement-breakpoint
CREATE INDEX "lesson_player_block_items_drill_idx" ON "lesson_player_block_items" USING btree ("drill_id");--> statement-breakpoint
CREATE INDEX "lesson_player_block_items_mechanic_idx" ON "lesson_player_block_items" USING btree ("mechanic_id");--> statement-breakpoint
CREATE INDEX "lesson_player_blocks_lesson_player_idx" ON "lesson_player_blocks" USING btree ("lesson_player_id");--> statement-breakpoint
CREATE INDEX "lesson_player_blocks_block_type_idx" ON "lesson_player_blocks" USING btree ("block_type_id");--> statement-breakpoint
CREATE UNIQUE INDEX "lesson_player_blocks_lesson_player_sort_unique" ON "lesson_player_blocks" USING btree ("lesson_player_id","sort_order");--> statement-breakpoint
CREATE INDEX "lesson_player_blocks_lesson_player_block_type_idx" ON "lesson_player_blocks" USING btree ("lesson_player_id","block_type_id");--> statement-breakpoint
CREATE INDEX "development_plan_routines_plan_idx" ON "development_plan_routines" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "development_plan_routines_routine_idx" ON "development_plan_routines" USING btree ("routine_id");--> statement-breakpoint
CREATE UNIQUE INDEX "development_plan_routines_unique" ON "development_plan_routines" USING btree ("plan_id","routine_id");--> statement-breakpoint
CREATE INDEX "routine_block_items_block_idx" ON "routine_block_items" USING btree ("routine_block_id");--> statement-breakpoint
CREATE INDEX "routine_block_items_block_sort_idx" ON "routine_block_items" USING btree ("routine_block_id","sort_order");--> statement-breakpoint
CREATE INDEX "routine_block_items_type_idx" ON "routine_block_items" USING btree ("item_type");--> statement-breakpoint
CREATE INDEX "routine_blocks_routine_idx" ON "routine_blocks" USING btree ("routine_id");--> statement-breakpoint
CREATE INDEX "routine_blocks_block_type_idx" ON "routine_blocks" USING btree ("block_type_id");--> statement-breakpoint
CREATE UNIQUE INDEX "routine_blocks_routine_sort_unique" ON "routine_blocks" USING btree ("routine_id","sort_order");--> statement-breakpoint
CREATE INDEX "routines_discipline_idx" ON "routines" USING btree ("discipline_id");--> statement-breakpoint
CREATE INDEX "routines_player_idx" ON "routines" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "routines_created_by_idx" ON "routines" USING btree ("created_by");