CREATE TYPE "public"."performance_ingest_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."performance_session_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."performance_source" AS ENUM('hittrax', 'blast', 'trackman');--> statement-breakpoint
CREATE TABLE "performance_session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"lesson_id" uuid,
	"source" "performance_source" NOT NULL,
	"session_date" timestamp NOT NULL,
	"raw_upload_id" uuid,
	"status" "performance_session_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "performance_session" ADD CONSTRAINT "performance_session_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "performance_session" ADD CONSTRAINT "performance_session_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "performance_session_player_idx" ON "performance_session" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "performance_session_lesson_idx" ON "performance_session" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "performance_session_source_idx" ON "performance_session" USING btree ("source");--> statement-breakpoint
CREATE INDEX "performance_session_date_idx" ON "performance_session" USING btree ("session_date");