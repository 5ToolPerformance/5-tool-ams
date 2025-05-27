CREATE TABLE "arm_care" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"coachId" uuid NOT NULL,
	"notes" text,
	"shoulder_er_l" real NOT NULL,
	"shoulder_er_r" real NOT NULL,
	"shoulder_ir_l" real NOT NULL,
	"shoulder_ir_r" real NOT NULL,
	"shoulder_flexion_l" real NOT NULL,
	"shoulder_flexion_r" real NOT NULL,
	"supine_hip_er_l" real NOT NULL,
	"supine_hip_er_r" real NOT NULL,
	"supine_hip_ir_l" real NOT NULL,
	"supine_hip_ir_r" real NOT NULL,
	"straight_leg_l" real NOT NULL,
	"straight_leg_r" real NOT NULL,
	"lesson_date" timestamp NOT NULL,
	"created_on" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hawkins_force_plate" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"coachId" uuid NOT NULL,
	"notes" text,
	"cmj" real NOT NULL,
	"drop_jump" real NOT NULL,
	"pogo" real NOT NULL,
	"mid_thigh_pull" real NOT NULL,
	"mtp_time" real NOT NULL,
	"cop_ml_l" real NOT NULL,
	"cop_ml_r" real NOT NULL,
	"cop_ap_l" real NOT NULL,
	"cop_ap_r" real NOT NULL,
	"lesson_date" timestamp NOT NULL,
	"created_on" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "smfa" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"coachId" uuid NOT NULL,
	"notes" text,
	"pelvic_rotation_l" real NOT NULL,
	"pelvic_rotation_r" real NOT NULL,
	"seated_trunk_rotation_l" real NOT NULL,
	"seated_trunk_rotation_r" real NOT NULL,
	"ankle_test_l" real NOT NULL,
	"ankle_test_r" real NOT NULL,
	"forearm_test_l" real NOT NULL,
	"forearm_test_r" real NOT NULL,
	"cervical_rotation_l" real NOT NULL,
	"cervical_rotation_r" real NOT NULL,
	"msf_l" real NOT NULL,
	"msf_r" real NOT NULL,
	"mse_l" real NOT NULL,
	"mse_r" real NOT NULL,
	"msr_l" real NOT NULL,
	"msr_r" real NOT NULL,
	"pelvic_tilt" real NOT NULL,
	"squat_test" real NOT NULL,
	"cervical_flexion" real NOT NULL,
	"cervical_extension" real NOT NULL,
	"lesson_date" timestamp NOT NULL,
	"created_on" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "true_strength" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"coachId" uuid NOT NULL,
	"notes" text,
	"seated_shoulder_er_l" real NOT NULL,
	"seated_shoulder_er_r" real NOT NULL,
	"seated_shoulder_ir_l" real NOT NULL,
	"seated_shoulder_ir_r" real NOT NULL,
	"shoulder_rotation_l" real NOT NULL,
	"shoulder_rotation_r" real NOT NULL,
	"shoulder_rotation_rfd_l" real NOT NULL,
	"shoulder_rotation_rfd_r" real NOT NULL,
	"hip_rotation_l" real NOT NULL,
	"hip_rotation_r" real NOT NULL,
	"hip_rotation_rfd_l" real NOT NULL,
	"hip_rotation_rfd_r" real NOT NULL,
	"lesson_date" timestamp NOT NULL,
	"created_on" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "arm_care" ADD CONSTRAINT "arm_care_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arm_care" ADD CONSTRAINT "arm_care_coachId_user_id_fk" FOREIGN KEY ("coachId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hawkins_force_plate" ADD CONSTRAINT "hawkins_force_plate_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hawkins_force_plate" ADD CONSTRAINT "hawkins_force_plate_coachId_user_id_fk" FOREIGN KEY ("coachId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "smfa" ADD CONSTRAINT "smfa_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "smfa" ADD CONSTRAINT "smfa_coachId_user_id_fk" FOREIGN KEY ("coachId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "true_strength" ADD CONSTRAINT "true_strength_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "true_strength" ADD CONSTRAINT "true_strength_coachId_user_id_fk" FOREIGN KEY ("coachId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;