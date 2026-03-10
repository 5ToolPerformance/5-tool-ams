ALTER TABLE "development_plan_routines" ADD COLUMN "document_data" jsonb;--> statement-breakpoint
ALTER TABLE "development_plans" ADD COLUMN "document_data" jsonb;--> statement-breakpoint
ALTER TABLE "evaluations" ADD COLUMN "document_data" jsonb;