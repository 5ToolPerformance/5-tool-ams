CREATE TYPE "public"."weekly_usage_report_status" AS ENUM('pending', 'complete', 'failed');--> statement-breakpoint
CREATE TABLE "weekly_usage_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid,
	"week_start" timestamp with time zone NOT NULL,
	"week_end" timestamp with time zone NOT NULL,
	"status" "weekly_usage_report_status" DEFAULT 'pending' NOT NULL,
	"report_version" integer DEFAULT 1 NOT NULL,
	"report_data" jsonb NOT NULL,
	"generated_at" timestamp with time zone,
	"failed_at" timestamp with time zone,
	"error_message" text,
	"generated_by_user_id" uuid,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_on" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "weekly_usage_reports" ADD CONSTRAINT "weekly_usage_reports_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_usage_reports" ADD CONSTRAINT "weekly_usage_reports_generated_by_user_id_user_id_fk" FOREIGN KEY ("generated_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "weekly_usage_reports_facility_week_unique" ON "weekly_usage_reports" USING btree ("facility_id","week_start","week_end");--> statement-breakpoint
CREATE INDEX "weekly_usage_reports_facility_week_start_idx" ON "weekly_usage_reports" USING btree ("facility_id","week_start");--> statement-breakpoint
CREATE INDEX "weekly_usage_reports_status_idx" ON "weekly_usage_reports" USING btree ("status");