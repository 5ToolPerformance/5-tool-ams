CREATE TYPE "public"."allowed_user_status" AS ENUM('invited', 'active', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."auth_provider" AS ENUM('google', 'entra');--> statement-breakpoint
CREATE TABLE "allowed_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"provider" "auth_provider" NOT NULL,
	"status" "allowed_user_status" DEFAULT 'invited' NOT NULL,
	"organization_id" uuid NOT NULL,
	"role" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX "allowed_users_org_provider_email_uniq" ON "allowed_users" USING btree ("organization_id","provider","email");