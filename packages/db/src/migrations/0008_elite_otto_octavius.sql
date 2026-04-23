CREATE TYPE "public"."lesson_types" AS ENUM('strength', 'hitting', 'pithing', 'fielding');--> statement-breakpoint
CREATE TABLE "lesson" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"coachId" uuid NOT NULL,
	"type" "lesson_types" NOT NULL,
	"armCare" uuid,
	"smfa" uuid,
	"hawkins_force" uuid,
	"true_strength" uuid,
	"notes" text,
	"created_on" timestamp DEFAULT now() NOT NULL,
	"lesson_date" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_coachId_user_id_fk" FOREIGN KEY ("coachId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_armCare_arm_care_id_fk" FOREIGN KEY ("armCare") REFERENCES "public"."arm_care"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_smfa_smfa_id_fk" FOREIGN KEY ("smfa") REFERENCES "public"."smfa"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_hawkins_force_hawkins_force_plate_id_fk" FOREIGN KEY ("hawkins_force") REFERENCES "public"."hawkins_force_plate"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_true_strength_true_strength_id_fk" FOREIGN KEY ("true_strength") REFERENCES "public"."true_strength"("id") ON DELETE cascade ON UPDATE no action;