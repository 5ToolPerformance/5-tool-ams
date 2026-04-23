CREATE TYPE "public"."assessment_type" AS ENUM('are_care', 'smfa', 'force_plate', 'true_strength');--> statement-breakpoint
CREATE TABLE "lesson_assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lesson_id" uuid NOT NULL,
	"assessment_type" "assessment_type" NOT NULL,
	"assessment_id" uuid NOT NULL,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lesson_assessments" ADD CONSTRAINT "lesson_assessments_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lesson_assessments_lesson_idx" ON "lesson_assessments" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "lesson_assessments_type_idx" ON "lesson_assessments" USING btree ("assessment_type");--> statement-breakpoint
CREATE INDEX "lesson_assessments_unique_idx" ON "lesson_assessments" USING btree ("assessment_type","assessment_id");