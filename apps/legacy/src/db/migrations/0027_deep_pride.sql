ALTER TYPE "public"."assessment_type" ADD VALUE 'fielding_assessment';--> statement-breakpoint
ALTER TYPE "public"."assessment_type" ADD VALUE 'catching_assessment';--> statement-breakpoint
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
ALTER TABLE "fielding_assessment" ADD CONSTRAINT "fielding_assessment_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "fielding_assessment_lesson_idx" ON "fielding_assessment" USING btree ("lesson_id");