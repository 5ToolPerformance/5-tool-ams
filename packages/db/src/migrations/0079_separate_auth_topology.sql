DO $$ BEGIN
 CREATE TYPE "public"."system_role" AS ENUM('standard', 'super_admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "system_role" "system_role" DEFAULT 'standard' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_roles" ADD COLUMN IF NOT EXISTS "access" "access" DEFAULT 'read/write' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_roles" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
UPDATE "user_roles"
SET "access" = 'read/write'
WHERE "access" IS NULL;--> statement-breakpoint
UPDATE "user_roles"
SET "is_active" = true
WHERE "is_active" IS NULL;--> statement-breakpoint
