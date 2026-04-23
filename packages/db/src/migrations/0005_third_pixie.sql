ALTER TABLE "athletic_development" RENAME TO "notes";--> statement-breakpoint
ALTER TABLE "notes" DROP CONSTRAINT "athletic_development_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "coachId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_coachId_user_id_fk" FOREIGN KEY ("coachId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;