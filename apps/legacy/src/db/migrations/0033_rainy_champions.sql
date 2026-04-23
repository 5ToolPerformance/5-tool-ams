ALTER TYPE "public"."linking_method" ADD VALUE 'external_id';--> statement-breakpoint
ALTER TABLE "external_sync_logs" DROP CONSTRAINT "external_sync_logs_system_unique";