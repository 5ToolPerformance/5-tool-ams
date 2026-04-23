CREATE TABLE "hittrax_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"event_index" integer NOT NULL,
	"at_bat" integer,
	"event_timestamp" timestamp,
	"pitch_velocity" numeric(6, 2),
	"pitch_type" text,
	"exit_velo" numeric(6, 2),
	"launch_angle" numeric(6, 2),
	"distance" numeric(8, 2),
	"horizontal_angle" numeric(6, 2),
	"contact_type" text,
	"result" text,
	"spray_x" numeric(8, 3),
	"spray_z" numeric(8, 3),
	"poi_x" numeric(8, 3),
	"poi_y" numeric(8, 3),
	"poi_z" numeric(8, 3),
	"vertical_distance" numeric(8, 3),
	"horizontal_distance" numeric(8, 3),
	"raw_row" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hittrax_session_summary" (
	"session_id" uuid PRIMARY KEY NOT NULL,
	"total_events" integer NOT NULL,
	"avg_exit_velo" numeric(6, 2),
	"max_exit_velo" numeric(6, 2),
	"avg_launch_angle" numeric(6, 2),
	"avg_distance" numeric(8, 2),
	"hard_hit_percentage" numeric(5, 2),
	"line_drive_percentage" numeric(5, 2),
	"ground_ball_percentage" numeric(5, 2),
	"fly_ball_percentage" numeric(5, 2),
	"total_ab" integer NOT NULL,
	"total_hits" integer NOT NULL,
	"batting_average" numeric(5, 3)
);
--> statement-breakpoint
CREATE TABLE "performance_ingest_job" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"status" "performance_ingest_status" DEFAULT 'pending' NOT NULL,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"error_message" text,
	"locked_at" timestamp,
	"locked_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hittrax_event" ADD CONSTRAINT "hittrax_event_session_id_performance_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."performance_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hittrax_session_summary" ADD CONSTRAINT "hittrax_session_summary_session_id_performance_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."performance_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "performance_ingest_job" ADD CONSTRAINT "performance_ingest_job_session_id_performance_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."performance_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "hittrax_event_session_idx" ON "hittrax_event" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "hittrax_event_session_event_idx" ON "hittrax_event" USING btree ("session_id","event_index");--> statement-breakpoint
CREATE INDEX "hittrax_summary_session_idx" ON "hittrax_session_summary" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "performance_ingest_status_idx" ON "performance_ingest_job" USING btree ("status");--> statement-breakpoint
CREATE INDEX "performance_ingest_session_idx" ON "performance_ingest_job" USING btree ("session_id");