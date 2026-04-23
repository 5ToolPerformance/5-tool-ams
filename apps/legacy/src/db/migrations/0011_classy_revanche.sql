ALTER TABLE "arm_care" RENAME COLUMN "userId" TO "player_id";--> statement-breakpoint
ALTER TABLE "arm_care" RENAME COLUMN "coachId" TO "coach_id";--> statement-breakpoint
ALTER TABLE "hawkins_force_plate" RENAME COLUMN "userId" TO "player_id";--> statement-breakpoint
ALTER TABLE "hawkins_force_plate" RENAME COLUMN "coachId" TO "coach_id";--> statement-breakpoint
ALTER TABLE "lesson" RENAME COLUMN "userId" TO "player_id";--> statement-breakpoint
ALTER TABLE "lesson" RENAME COLUMN "coachId" TO "coach_id";--> statement-breakpoint
ALTER TABLE "lesson" RENAME COLUMN "type" TO "lesson_type";--> statement-breakpoint
ALTER TABLE "smfa" RENAME COLUMN "userId" TO "player_id";--> statement-breakpoint
ALTER TABLE "smfa" RENAME COLUMN "coachId" TO "coach_id";--> statement-breakpoint
ALTER TABLE "true_strength" RENAME COLUMN "userId" TO "player_id";--> statement-breakpoint
ALTER TABLE "true_strength" RENAME COLUMN "coachId" TO "coach_id";--> statement-breakpoint
ALTER TABLE "arm_care" DROP CONSTRAINT "arm_care_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "arm_care" DROP CONSTRAINT "arm_care_coachId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "hawkins_force_plate" DROP CONSTRAINT "hawkins_force_plate_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "hawkins_force_plate" DROP CONSTRAINT "hawkins_force_plate_coachId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "lesson" DROP CONSTRAINT "lesson_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "lesson" DROP CONSTRAINT "lesson_coachId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "lesson" DROP CONSTRAINT "lesson_armCare_arm_care_id_fk";
--> statement-breakpoint
ALTER TABLE "lesson" DROP CONSTRAINT "lesson_smfa_smfa_id_fk";
--> statement-breakpoint
ALTER TABLE "lesson" DROP CONSTRAINT "lesson_hawkins_force_hawkins_force_plate_id_fk";
--> statement-breakpoint
ALTER TABLE "lesson" DROP CONSTRAINT "lesson_true_strength_true_strength_id_fk";
--> statement-breakpoint
ALTER TABLE "smfa" DROP CONSTRAINT "smfa_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "smfa" DROP CONSTRAINT "smfa_coachId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "true_strength" DROP CONSTRAINT "true_strength_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "true_strength" DROP CONSTRAINT "true_strength_coachId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "arm_care" ADD COLUMN "lesson_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "hawkins_force_plate" ADD COLUMN "lesson_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "smfa" ADD COLUMN "lesson_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "true_strength" ADD COLUMN "lesson_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "arm_care" ADD CONSTRAINT "arm_care_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hawkins_force_plate" ADD CONSTRAINT "hawkins_force_plate_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_player_id_user_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_coach_id_user_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "smfa" ADD CONSTRAINT "smfa_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "true_strength" ADD CONSTRAINT "true_strength_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "arm_care_lesson_idx" ON "arm_care" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "arm_care_coach_idx" ON "arm_care" USING btree ("coach_id");--> statement-breakpoint
CREATE INDEX "arm_care_player_idx" ON "arm_care" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "hawkins_force_plate_lesson_idx" ON "hawkins_force_plate" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "lesson_coach_idx" ON "lesson" USING btree ("coach_id");--> statement-breakpoint
CREATE INDEX "lesson_player_idx" ON "lesson" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "lesson_type_idx" ON "lesson" USING btree ("lesson_type");--> statement-breakpoint
CREATE INDEX "lesson_date_idx" ON "lesson" USING btree ("lesson_date");--> statement-breakpoint
CREATE INDEX "smfa_lesson_idx" ON "smfa" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "smfa_coach_idx" ON "smfa" USING btree ("coach_id");--> statement-breakpoint
CREATE INDEX "smfa_player_idx" ON "smfa" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "true_strength_lesson_idx" ON "true_strength" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "true_strength_coach_idx" ON "true_strength" USING btree ("coach_id");--> statement-breakpoint
CREATE INDEX "true_strength_user_idx" ON "true_strength" USING btree ("player_id");--> statement-breakpoint
ALTER TABLE "lesson" DROP COLUMN "armCare";--> statement-breakpoint
ALTER TABLE "lesson" DROP COLUMN "smfa";--> statement-breakpoint
ALTER TABLE "lesson" DROP COLUMN "hawkins_force";--> statement-breakpoint
ALTER TABLE "lesson" DROP COLUMN "true_strength";