ALTER TABLE "attachments" ADD COLUMN IF NOT EXISTS "injury_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attachments" ADD CONSTRAINT "attachments_injury_id_injury_id_fk" FOREIGN KEY ("injury_id") REFERENCES "public"."injury"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
