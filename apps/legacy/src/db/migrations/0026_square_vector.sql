ALTER TABLE "hittrax_assessment" ADD COLUMN "created_on" date DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "velo_assessment" ADD COLUMN "created_on" date DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX "hittrax_assessment_lesson_idx" ON "hittrax_assessment" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "velo_assessment_lesson_idx" ON "velo_assessment" USING btree ("lesson_id");