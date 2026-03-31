CREATE TYPE "public"."client_invite_status" AS ENUM('pending', 'accepted', 'expired', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."client_relationship_type" AS ENUM('parent', 'guardian', 'self', 'other');--> statement-breakpoint
CREATE TYPE "public"."portal_access_status" AS ENUM('active', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."user_role_type" AS ENUM('player', 'coach', 'admin', 'client');--> statement-breakpoint
CREATE TABLE "client_invite_players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invite_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"relationship_type" "client_relationship_type" NOT NULL,
	"status" "client_invite_status" DEFAULT 'pending' NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_by" uuid NOT NULL,
	"accepted_by_user_id" uuid,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL,
	"accepted_on" timestamp with time zone,
	"revoked_on" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "client_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"facility_id" uuid NOT NULL,
	"first_name" text,
	"last_name" text,
	"phone" text,
	"onboarding_complete" boolean DEFAULT false NOT NULL,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_on" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player_client_access" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"relationship_type" "client_relationship_type" NOT NULL,
	"status" "portal_access_status" DEFAULT 'active' NOT NULL,
	"can_view" boolean DEFAULT true NOT NULL,
	"can_log_activity" boolean DEFAULT true NOT NULL,
	"can_upload" boolean DEFAULT true NOT NULL,
	"can_message" boolean DEFAULT true NOT NULL,
	"is_primary_contact" boolean DEFAULT false NOT NULL,
	"created_by" uuid,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_on" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_on" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"facility_id" uuid NOT NULL,
	"role" "user_role_type" NOT NULL,
	"created_on" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "client_invite_players" ADD CONSTRAINT "client_invite_players_invite_id_client_invites_id_fk" FOREIGN KEY ("invite_id") REFERENCES "public"."client_invites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_invite_players" ADD CONSTRAINT "client_invite_players_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_invites" ADD CONSTRAINT "client_invites_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_invites" ADD CONSTRAINT "client_invites_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_invites" ADD CONSTRAINT "client_invites_accepted_by_user_id_user_id_fk" FOREIGN KEY ("accepted_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_profiles" ADD CONSTRAINT "client_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_profiles" ADD CONSTRAINT "client_profiles_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_client_access" ADD CONSTRAINT "player_client_access_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_client_access" ADD CONSTRAINT "player_client_access_player_id_player_information_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player_information"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_client_access" ADD CONSTRAINT "player_client_access_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_client_access" ADD CONSTRAINT "player_client_access_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "client_invite_players_invite_idx" ON "client_invite_players" USING btree ("invite_id");--> statement-breakpoint
CREATE INDEX "client_invite_players_player_idx" ON "client_invite_players" USING btree ("player_id");--> statement-breakpoint
CREATE UNIQUE INDEX "client_invite_players_invite_player_unique" ON "client_invite_players" USING btree ("invite_id","player_id");--> statement-breakpoint
CREATE INDEX "client_invites_email_idx" ON "client_invites" USING btree ("email");--> statement-breakpoint
CREATE INDEX "client_invites_facility_idx" ON "client_invites" USING btree ("facility_id");--> statement-breakpoint
CREATE INDEX "client_invites_status_idx" ON "client_invites" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "client_invites_token_hash_unique" ON "client_invites" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "client_profiles_user_idx" ON "client_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "client_profiles_facility_idx" ON "client_profiles" USING btree ("facility_id");--> statement-breakpoint
CREATE UNIQUE INDEX "client_profiles_user_facility_unique" ON "client_profiles" USING btree ("user_id","facility_id");--> statement-breakpoint
CREATE INDEX "player_client_access_player_idx" ON "player_client_access" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "player_client_access_user_idx" ON "player_client_access" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "player_client_access_facility_idx" ON "player_client_access" USING btree ("facility_id");--> statement-breakpoint
CREATE INDEX "player_client_access_status_idx" ON "player_client_access" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "player_client_access_player_user_unique" ON "player_client_access" USING btree ("player_id","user_id");--> statement-breakpoint
CREATE INDEX "user_roles_user_idx" ON "user_roles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_roles_facility_idx" ON "user_roles" USING btree ("facility_id");--> statement-breakpoint
CREATE INDEX "user_roles_role_idx" ON "user_roles" USING btree ("role");--> statement-breakpoint
CREATE UNIQUE INDEX "user_roles_user_facility_role_unique" ON "user_roles" USING btree ("user_id","facility_id","role");