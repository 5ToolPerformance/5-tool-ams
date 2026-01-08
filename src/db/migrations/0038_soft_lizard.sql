CREATE TABLE "hawkins_cmj" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"external_uniqueId" text NOT NULL,
	"athlete_id" text NOT NULL,
	"athlete_name" text,
	"testType_name" text NOT NULL,
	"testType_canonicalId" text NOT NULL,
	"rawData" jsonb NOT NULL,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"jump_height_m" numeric,
	"peak_propulsive_power_w" numeric,
	"avg_propulsive_velocity_m_s" numeric,
	"propulsive_impulse_n_s" numeric,
	"p1_propulsive_impulse_n_s" numeric,
	"p2_propulsive_impulse_n_s" numeric,
	"p1p2_propulsive_impulse_index" numeric
);
--> statement-breakpoint
CREATE TABLE "hawkins_drop_jump" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"external_uniqueId" text NOT NULL,
	"athlete_id" text NOT NULL,
	"athlete_name" text,
	"testType_name" text NOT NULL,
	"testType_canonicalId" text NOT NULL,
	"rawData" jsonb NOT NULL,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"mrsi" numeric
);
--> statement-breakpoint
CREATE TABLE "hawkins_iso" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"external_uniqueId" text NOT NULL,
	"athlete_id" text NOT NULL,
	"athlete_name" text,
	"testType_name" text NOT NULL,
	"testType_canonicalId" text NOT NULL,
	"rawData" jsonb NOT NULL,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"length_of_pull_s" numeric,
	"time_to_peak_force_s" numeric,
	"peak_force_n" numeric
);
--> statement-breakpoint
CREATE TABLE "hawkins_multi" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"external_uniqueId" text NOT NULL,
	"athlete_id" text NOT NULL,
	"athlete_name" text,
	"testType_name" text NOT NULL,
	"testType_canonicalId" text NOT NULL,
	"rawData" jsonb NOT NULL,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"avg_mrsi" numeric
);
--> statement-breakpoint
CREATE TABLE "hawkins_ts_iso" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"external_uniqueId" text NOT NULL,
	"athlete_id" text NOT NULL,
	"athlete_name" text,
	"testType_name" text NOT NULL,
	"testType_canonicalId" text NOT NULL,
	"rawData" jsonb NOT NULL,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"peak_force_n" numeric
);
--> statement-breakpoint
CREATE UNIQUE INDEX "hawkins_cmj_unique_attempt" ON "hawkins_cmj" USING btree ("athlete_id","timestamp","external_uniqueId");--> statement-breakpoint
CREATE UNIQUE INDEX "hawkins_drop_jump_unique_attempt" ON "hawkins_drop_jump" USING btree ("athlete_id","timestamp","external_uniqueId");--> statement-breakpoint
CREATE UNIQUE INDEX "hawkins_iso_unique_attempt" ON "hawkins_iso" USING btree ("athlete_id","timestamp","external_uniqueId");--> statement-breakpoint
CREATE UNIQUE INDEX "hawkins_multi_unique_attempt" ON "hawkins_multi" USING btree ("athlete_id","timestamp","external_uniqueId");--> statement-breakpoint
CREATE UNIQUE INDEX "hawkins_ts_iso_unique_attempt" ON "hawkins_ts_iso" USING btree ("athlete_id","timestamp","external_uniqueId");