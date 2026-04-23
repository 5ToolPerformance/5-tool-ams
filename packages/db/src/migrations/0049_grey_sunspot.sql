ALTER TABLE "attachments" DROP CONSTRAINT "attachments_created_by_player_information_id_fk";
--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;