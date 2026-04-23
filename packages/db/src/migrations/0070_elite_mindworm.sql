ALTER TYPE "public"."evaluation_type" ADD VALUE 'tests_only';--> statement-breakpoint
ALTER TABLE "attachments" ADD COLUMN "evaluation_id" uuid;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_evaluation_id_evaluations_id_fk" FOREIGN KEY ("evaluation_id") REFERENCES "public"."evaluations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attachments_evaluation_id_idx" ON "attachments" USING btree ("evaluation_id");