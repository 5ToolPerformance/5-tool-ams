ALTER TABLE "user"
ADD COLUMN "facility_id" uuid;

ALTER TABLE "user"
ADD CONSTRAINT "user_facility_id_facilities_id_fk"
FOREIGN KEY ("facility_id")
REFERENCES "public"."facilities"("id")
ON DELETE set null
ON UPDATE no action;

CREATE INDEX "user_facility_idx" ON "user" USING btree ("facility_id");

ALTER TABLE "player_information"
ADD COLUMN "facility_id" uuid;

ALTER TABLE "player_information"
ADD CONSTRAINT "player_information_facility_id_facilities_id_fk"
FOREIGN KEY ("facility_id")
REFERENCES "public"."facilities"("id")
ON DELETE set null
ON UPDATE no action;

CREATE INDEX "player_information_facility_idx" ON "player_information" USING btree ("facility_id");
CREATE INDEX "player_information_user_id_idx" ON "player_information" USING btree ("userId");

CREATE TYPE "public"."player_account_link_action" AS ENUM('linked', 'reassigned', 'unlinked_existing_user');

CREATE TABLE "player_account_link_audit" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "player_id" uuid NOT NULL,
  "previous_user_id" uuid,
  "next_user_id" uuid,
  "linked_email" text NOT NULL,
  "provider" "auth_provider" NOT NULL,
  "action_by_admin_id" uuid NOT NULL,
  "action" "player_account_link_action" NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "player_account_link_audit"
ADD CONSTRAINT "player_account_link_audit_player_id_player_information_id_fk"
FOREIGN KEY ("player_id")
REFERENCES "public"."player_information"("id")
ON DELETE cascade
ON UPDATE no action;

ALTER TABLE "player_account_link_audit"
ADD CONSTRAINT "player_account_link_audit_previous_user_id_user_id_fk"
FOREIGN KEY ("previous_user_id")
REFERENCES "public"."user"("id")
ON DELETE set null
ON UPDATE no action;

ALTER TABLE "player_account_link_audit"
ADD CONSTRAINT "player_account_link_audit_next_user_id_user_id_fk"
FOREIGN KEY ("next_user_id")
REFERENCES "public"."user"("id")
ON DELETE set null
ON UPDATE no action;

ALTER TABLE "player_account_link_audit"
ADD CONSTRAINT "player_account_link_audit_action_by_admin_id_user_id_fk"
FOREIGN KEY ("action_by_admin_id")
REFERENCES "public"."user"("id")
ON DELETE cascade
ON UPDATE no action;
