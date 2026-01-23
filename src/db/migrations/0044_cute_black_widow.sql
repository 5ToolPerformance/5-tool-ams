CREATE TABLE "athlete_cohorts" (
	"athlete_id" uuid NOT NULL,
	"cohort_id" uuid NOT NULL
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
CREATE TABLE "cohort_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
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
CREATE TABLE "metric_weights" (
	"metric_id" uuid NOT NULL,
	"score_type" text NOT NULL,
	"weight" real NOT NULL
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
ALTER TABLE "athlete_cohorts" ADD CONSTRAINT "athlete_cohorts_athlete_id_player_information_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_cohorts" ADD CONSTRAINT "athlete_cohorts_cohort_id_cohort_definitions_id_fk" FOREIGN KEY ("cohort_id") REFERENCES "public"."cohort_definitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_context_flags" ADD CONSTRAINT "athlete_context_flags_athlete_id_player_information_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_events" ADD CONSTRAINT "athlete_events_athlete_id_player_information_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_metric_snapshots" ADD CONSTRAINT "athlete_metric_snapshots_athlete_id_player_information_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_metric_snapshots" ADD CONSTRAINT "athlete_metric_snapshots_metric_id_metric_definitions_id_fk" FOREIGN KEY ("metric_id") REFERENCES "public"."metric_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cohort_metric_stats" ADD CONSTRAINT "cohort_metric_stats_cohort_id_cohort_definitions_id_fk" FOREIGN KEY ("cohort_id") REFERENCES "public"."cohort_definitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cohort_metric_stats" ADD CONSTRAINT "cohort_metric_stats_metric_id_metric_definitions_id_fk" FOREIGN KEY ("metric_id") REFERENCES "public"."metric_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "computed_scores" ADD CONSTRAINT "computed_scores_athlete_id_player_information_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric_sources" ADD CONSTRAINT "metric_sources_metric_id_metric_definitions_id_fk" FOREIGN KEY ("metric_id") REFERENCES "public"."metric_definitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metric_weights" ADD CONSTRAINT "metric_weights_metric_id_metric_definitions_id_fk" FOREIGN KEY ("metric_id") REFERENCES "public"."metric_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_positions" ADD CONSTRAINT "player_positions_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_positions" ADD CONSTRAINT "player_positions_position_id_positions_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."positions"("id") ON DELETE cascade ON UPDATE no action;