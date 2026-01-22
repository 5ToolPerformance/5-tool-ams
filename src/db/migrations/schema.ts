import { pgTable, foreignKey, uuid, real, text, date, boolean, timestamp, integer, unique, varchar, index, jsonb, time, numeric, uniqueIndex, serial, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const access = pgEnum("access", ['read/write', 'read-only', 'write-only'])
export const allowedUserStatus = pgEnum("allowed_user_status", ['invited', 'active', 'revoked'])
export const archetypes = pgEnum("archetypes", ['aerial', 'terrestrial'])
export const assessmentType = pgEnum("assessment_type", ['are_care', 'smfa', 'force_plate', 'true_strength', 'arm_care', 'hitting_assessment', 'pitching_assessment', 'hit_trax_assessment', 'velo_assessment', 'fielding_assessment', 'catching_assessment'])
export const authProvider = pgEnum("auth_provider", ['google', 'entra'])
export const dateRange = pgEnum("date_range", ['1-2', '3-4', '5-6', '7+', 'na'])
export const externalSystem = pgEnum("external_system", ['armcare', 'trackman', 'hittrax', 'hawkin'])
export const injurySeverity = pgEnum("injury_severity", ['mild', 'moderate', 'severe', 'unknown'])
export const injuryStatus = pgEnum("injury_status", ['active', 'resolved', 'recurring', 'monitoring'])
export const leftRight = pgEnum("left-right", ['left', 'right', 'switch'])
export const lessonTypes = pgEnum("lesson_types", ['strength', 'hitting', 'pitching', 'fielding', 'catching'])
export const lessonTypesOld = pgEnum("lesson_types_old", ['strength', 'hitting', 'pithing', 'fielding', 'pitching'])
export const linkingMethod = pgEnum("linking_method", ['email_match', 'phone', 'manual', 'name_match', 'external_id'])
export const linkingStatus = pgEnum("linking_status", ['active', 'pending', 'inactive', 'failed'])
export const mechanicType = pgEnum("mechanic_type", ['pitching', 'hitting', 'fielding', 'catching', 'strength'])
export const roles = pgEnum("roles", ['player', 'coach', 'admin'])
export const sports = pgEnum("sports", ['baseball', 'softball'])
export const syncStatus = pgEnum("sync_status", ['running', 'success', 'partial_success', 'failed'])


export const playerInformation = pgTable("player_information", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid(),
	height: real().notNull(),
	weight: real().notNull(),
	position: text().notNull(),
	throws: text().notNull(),
	hits: text().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	profilePictureUrl: text("profile_picture_url"),
	dateOfBirth: date("date_of_birth"),
	prospect: boolean().default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	sport: sports().default('baseball').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "player_information_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const account = pgTable("account", {
	userId: uuid().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const session = pgTable("session", {
	sessionToken: text().primaryKey().notNull(),
	userId: uuid().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const notes = pgTable("notes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid().notNull(),
	notes: text(),
	lessonDate: timestamp("lesson_date", { mode: 'string' }).notNull(),
	createdOn: timestamp("created_on", { mode: 'string' }).defaultNow().notNull(),
	coachId: uuid().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "notes_userId_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.coachId],
			foreignColumns: [user.id],
			name: "notes_coachId_user_id_fk"
		}).onDelete("cascade"),
]);

export const user = pgTable("user", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }),
	email: varchar({ length: 320 }).notNull(),
	emailVerified: timestamp({ mode: 'string' }),
	image: varchar({ length: 2048 }),
	role: roles().default('coach'),
	username: varchar({ length: 25 }),
	access: access().default('read/write'),
	isActive: boolean("is_active").default(true),
}, (table) => [
	unique("user_email_unique").on(table.email),
	unique("user_username_unique").on(table.username),
]);

export const armCare = pgTable("arm_care", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	playerId: uuid("player_id").notNull(),
	coachId: uuid("coach_id").notNull(),
	notes: text(),
	shoulderErL: real("shoulder_er_l").notNull(),
	shoulderErR: real("shoulder_er_r").notNull(),
	shoulderIrL: real("shoulder_ir_l").notNull(),
	shoulderIrR: real("shoulder_ir_r").notNull(),
	shoulderFlexionL: real("shoulder_flexion_l").notNull(),
	shoulderFlexionR: real("shoulder_flexion_r").notNull(),
	supineHipErL: real("supine_hip_er_l").notNull(),
	supineHipErR: real("supine_hip_er_r").notNull(),
	supineHipIrL: real("supine_hip_ir_l").notNull(),
	supineHipIrR: real("supine_hip_ir_r").notNull(),
	straightLegL: real("straight_leg_l").notNull(),
	straightLegR: real("straight_leg_r").notNull(),
	lessonDate: timestamp("lesson_date", { mode: 'string' }).notNull(),
	createdOn: timestamp("created_on", { mode: 'string' }).defaultNow().notNull(),
	lessonId: uuid("lesson_id").notNull(),
}, (table) => [
	index("arm_care_coach_idx").using("btree", table.coachId.asc().nullsLast().op("uuid_ops")),
	index("arm_care_lesson_idx").using("btree", table.lessonId.asc().nullsLast().op("uuid_ops")),
	index("arm_care_player_idx").using("btree", table.playerId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.lessonId],
			foreignColumns: [lesson.id],
			name: "arm_care_lesson_id_lesson_id_fk"
		}).onDelete("cascade"),
]);

export const hawkinsForcePlate = pgTable("hawkins_force_plate", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	playerId: uuid("player_id").notNull(),
	coachId: uuid("coach_id").notNull(),
	notes: text(),
	cmj: real().notNull(),
	dropJump: real("drop_jump").notNull(),
	pogo: real().notNull(),
	midThighPull: real("mid_thigh_pull").notNull(),
	mtpTime: real("mtp_time").notNull(),
	copMlL: real("cop_ml_l").notNull(),
	copMlR: real("cop_ml_r").notNull(),
	copApL: real("cop_ap_l").notNull(),
	copApR: real("cop_ap_r").notNull(),
	lessonDate: timestamp("lesson_date", { mode: 'string' }).notNull(),
	createdOn: timestamp("created_on", { mode: 'string' }).defaultNow().notNull(),
	lessonId: uuid("lesson_id").notNull(),
}, (table) => [
	index("hawkins_force_plate_lesson_idx").using("btree", table.lessonId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.lessonId],
			foreignColumns: [lesson.id],
			name: "hawkins_force_plate_lesson_id_lesson_id_fk"
		}).onDelete("cascade"),
]);

export const smfa = pgTable("smfa", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	playerId: uuid("player_id").notNull(),
	coachId: uuid("coach_id").notNull(),
	notes: text(),
	pelvicRotationL: real("pelvic_rotation_l").notNull(),
	pelvicRotationR: real("pelvic_rotation_r").notNull(),
	seatedTrunkRotationL: real("seated_trunk_rotation_l").notNull(),
	seatedTrunkRotationR: real("seated_trunk_rotation_r").notNull(),
	ankleTestL: real("ankle_test_l").notNull(),
	ankleTestR: real("ankle_test_r").notNull(),
	forearmTestL: real("forearm_test_l").notNull(),
	forearmTestR: real("forearm_test_r").notNull(),
	cervicalRotationL: real("cervical_rotation_l").notNull(),
	cervicalRotationR: real("cervical_rotation_r").notNull(),
	msfL: real("msf_l").notNull(),
	msfR: real("msf_r").notNull(),
	mseL: real("mse_l").notNull(),
	mseR: real("mse_r").notNull(),
	msrL: real("msr_l").notNull(),
	msrR: real("msr_r").notNull(),
	pelvicTilt: real("pelvic_tilt").notNull(),
	squatTest: real("squat_test").notNull(),
	cervicalFlexion: real("cervical_flexion").notNull(),
	cervicalExtension: real("cervical_extension").notNull(),
	lessonDate: timestamp("lesson_date", { mode: 'string' }).notNull(),
	createdOn: timestamp("created_on", { mode: 'string' }).defaultNow().notNull(),
	lessonId: uuid("lesson_id").notNull(),
}, (table) => [
	index("smfa_coach_idx").using("btree", table.coachId.asc().nullsLast().op("uuid_ops")),
	index("smfa_lesson_idx").using("btree", table.lessonId.asc().nullsLast().op("uuid_ops")),
	index("smfa_player_idx").using("btree", table.playerId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.lessonId],
			foreignColumns: [lesson.id],
			name: "smfa_lesson_id_lesson_id_fk"
		}).onDelete("cascade"),
]);

export const trueStrength = pgTable("true_strength", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	playerId: uuid("player_id").notNull(),
	coachId: uuid("coach_id").notNull(),
	notes: text(),
	seatedShoulderErL: real("seated_shoulder_er_l").notNull(),
	seatedShoulderErR: real("seated_shoulder_er_r").notNull(),
	seatedShoulderIrL: real("seated_shoulder_ir_l").notNull(),
	seatedShoulderIrR: real("seated_shoulder_ir_r").notNull(),
	shoulderRotationL: real("shoulder_rotation_l").notNull(),
	shoulderRotationR: real("shoulder_rotation_r").notNull(),
	shoulderRotationRfdL: real("shoulder_rotation_rfd_l").notNull(),
	shoulderRotationRfdR: real("shoulder_rotation_rfd_r").notNull(),
	hipRotationL: real("hip_rotation_l").notNull(),
	hipRotationR: real("hip_rotation_r").notNull(),
	hipRotationRfdL: real("hip_rotation_rfd_l").notNull(),
	hipRotationRfdR: real("hip_rotation_rfd_r").notNull(),
	lessonDate: timestamp("lesson_date", { mode: 'string' }).notNull(),
	createdOn: timestamp("created_on", { mode: 'string' }).defaultNow().notNull(),
	lessonId: uuid("lesson_id").notNull(),
}, (table) => [
	index("true_strength_coach_idx").using("btree", table.coachId.asc().nullsLast().op("uuid_ops")),
	index("true_strength_lesson_idx").using("btree", table.lessonId.asc().nullsLast().op("uuid_ops")),
	index("true_strength_user_idx").using("btree", table.playerId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.lessonId],
			foreignColumns: [lesson.id],
			name: "true_strength_lesson_id_lesson_id_fk"
		}).onDelete("cascade"),
]);

export const smfaBoolean = pgTable("smfa_boolean", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	playerId: uuid("player_id").notNull(),
	coachId: uuid("coach_id").notNull(),
	lessonId: uuid("lesson_id").notNull(),
	notes: text(),
	pelvicRotationL: boolean("pelvic_rotation_l").notNull(),
	pelvicRotationR: boolean("pelvic_rotation_r").notNull(),
	seatedTrunkRotationL: boolean("seated_trunk_rotation_l").notNull(),
	seatedTrunkRotationR: boolean("seated_trunk_rotation_r").notNull(),
	ankleTestL: boolean("ankle_test_l").notNull(),
	ankleTestR: boolean("ankle_test_r").notNull(),
	forearmTestL: boolean("forearm_test_l").notNull(),
	forearmTestR: boolean("forearm_test_r").notNull(),
	cervicalRotationL: boolean("cervical_rotation_l").notNull(),
	cervicalRotationR: boolean("cervical_rotation_r").notNull(),
	msfL: boolean("msf_l").notNull(),
	msfR: boolean("msf_r").notNull(),
	mseL: boolean("mse_l").notNull(),
	mseR: boolean("mse_r").notNull(),
	msrL: boolean("msr_l").notNull(),
	msrR: boolean("msr_r").notNull(),
	pelvicTilt: boolean("pelvic_tilt").notNull(),
	squatTest: boolean("squat_test").notNull(),
	cervicalFlexion: boolean("cervical_flexion").notNull(),
	cervicalExtension: boolean("cervical_extension").notNull(),
	lessonDate: timestamp("lesson_date", { mode: 'string' }).notNull(),
	createdOn: timestamp("created_on", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("smfa_boolean_coach_idx").using("btree", table.coachId.asc().nullsLast().op("uuid_ops")),
	index("smfa_boolean_lesson_idx").using("btree", table.lessonId.asc().nullsLast().op("uuid_ops")),
	index("smfa_boolean_player_idx").using("btree", table.playerId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.lessonId],
			foreignColumns: [lesson.id],
			name: "smfa_boolean_lesson_id_lesson_id_fk"
		}).onDelete("cascade"),
]);

export const lesson = pgTable("lesson", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	playerId: uuid("player_id").notNull(),
	coachId: uuid("coach_id").notNull(),
	lessonType: lessonTypes("lesson_type").notNull(),
	notes: text(),
	createdOn: timestamp("created_on", { mode: 'string' }).defaultNow().notNull(),
	lessonDate: timestamp("lesson_date", { mode: 'string' }).notNull(),
}, (table) => [
	index("lesson_coach_idx").using("btree", table.coachId.asc().nullsLast().op("uuid_ops")),
	index("lesson_date_idx").using("btree", table.lessonDate.asc().nullsLast().op("timestamp_ops")),
	index("lesson_player_idx").using("btree", table.playerId.asc().nullsLast().op("uuid_ops")),
	index("lesson_type_idx").using("btree", table.lessonType.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.coachId],
			foreignColumns: [user.id],
			name: "lesson_coach_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [playerInformation.id],
			name: "lesson_player_id_player_information_id_fk"
		}).onDelete("cascade"),
]);

export const playerMeasurements = pgTable("player_measurements", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	playerId: uuid("player_id").notNull(),
	height: real().notNull(),
	weight: real().notNull(),
	recordedOn: timestamp("recorded_on", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [playerInformation.id],
			name: "player_measurements_player_id_player_information_id_fk"
		}).onDelete("cascade"),
]);

export const fieldingAssessment = pgTable("fielding_assessment", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	playerId: uuid("player_id").notNull(),
	coachId: uuid("coach_id").notNull(),
	lessonId: uuid("lesson_id").notNull(),
	glovework: text(),
	footwork: text(),
	throwing: text(),
	throwdownCounter: real("throwdown_counter").notNull(),
	live: text(),
	consistency: text(),
	situational: text(),
	createdOn: timestamp("created_on", { mode: 'string' }).defaultNow().notNull(),
	lessonDate: timestamp("lesson_date", { mode: 'string' }).notNull(),
}, (table) => [
	index("fielding_assessment_lesson_idx").using("btree", table.lessonId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.lessonId],
			foreignColumns: [lesson.id],
			name: "fielding_assessment_lesson_id_lesson_id_fk"
		}).onDelete("cascade"),
]);

export const catchingAssessment = pgTable("catching_assessment", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	playerId: uuid("player_id").notNull(),
	coachId: uuid("coach_id").notNull(),
	lessonId: uuid("lesson_id").notNull(),
	feel: integer(),
	last4: integer("last_4"),
	readyBy: integer("ready_by"),
	catchThrow: text("catch_throw"),
	receiving: text(),
	blocking: text(),
	iq: text(),
	mobility: text(),
	numThrows: integer("num_throws"),
}, (table) => [
	index("catching_assessment_lesson_idx").using("btree", table.lessonId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.lessonId],
			foreignColumns: [lesson.id],
			name: "catching_assessment_lesson_id_lesson_id_fk"
		}).onDelete("cascade"),
]);

export const writeups = pgTable("writeups", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	coachId: uuid("coach_id").notNull(),
	playerId: uuid("player_id").notNull(),
	writeupType: text("writeup_type").notNull(),
	content: jsonb().notNull(),
	createdOn: timestamp("created_on", { mode: 'string' }).defaultNow(),
	notes: text(),
}, (table) => [
	foreignKey({
			columns: [table.coachId],
			foreignColumns: [user.id],
			name: "writeups_coach_id_user_id_fk"
		}),
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [playerInformation.id],
			name: "writeups_player_id_player_information_id_fk"
		}),
]);

export const playerInjuries = pgTable("player_injuries", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	playerId: uuid("player_id"),
	injuryType: text("injury_type").notNull(),
	injuryDate: timestamp("injury_date", { mode: 'string' }).notNull(),
	status: injuryStatus().default('active').notNull(),
	severity: injurySeverity().default('unknown').notNull(),
	description: text(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [playerInformation.id],
			name: "player_injuries_player_id_player_information_id_fk"
		}).onDelete("cascade"),
]);

export const hittraxAssessment = pgTable("hittrax_assessment", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	playerId: uuid("player_id").notNull(),
	coachId: uuid("coach_id").notNull(),
	lessonId: uuid("lesson_id").notNull(),
	pitchType: text("pitch_type"),
	avgExitVelo: real("avg_exit_velo"),
	avgHardHit: real("avg_hard_hit"),
	maxVelo: real("max_velo"),
	maxDist: real("max_dist"),
	fbAndGbPct: real("fb_and_gb_pct"),
	lineDrivePct: real("line_drive_pct"),
	createdOn: date("created_on").defaultNow().notNull(),
	lessonDate: date("lesson_date"),
}, (table) => [
	index("hittrax_assessment_lesson_idx").using("btree", table.lessonId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.lessonId],
			foreignColumns: [lesson.id],
			name: "hittrax_assessment_lesson_id_lesson_id_fk"
		}).onDelete("cascade"),
]);

export const motorPreferences = pgTable("motor_preferences", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	playerId: uuid("player_id").notNull(),
	coachId: uuid("coach_id").notNull(),
	archetype: archetypes().notNull(),
	extensionLeg: leftRight("extension_leg").notNull(),
	breath: boolean().notNull(),
	association: boolean().notNull(),
	createdOn: timestamp("created_on", { mode: 'string' }).defaultNow().notNull(),
	assessmentDate: timestamp("assessment_date", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [playerInformation.id],
			name: "motor_preferences_player_id_player_information_id_fk"
		}).onDelete("cascade"),
]);

export const lessonAssessments = pgTable("lesson_assessments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	lessonId: uuid("lesson_id").notNull(),
	assessmentType: assessmentType("assessment_type").notNull(),
	assessmentId: uuid("assessment_id").notNull(),
	createdOn: timestamp("created_on", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("lesson_assessments_lesson_idx").using("btree", table.lessonId.asc().nullsLast().op("uuid_ops")),
	index("lesson_assessments_type_idx").using("btree", table.assessmentType.asc().nullsLast().op("enum_ops")),
	index("lesson_assessments_unique_idx").using("btree", table.assessmentType.asc().nullsLast().op("enum_ops"), table.assessmentId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.lessonId],
			foreignColumns: [lesson.id],
			name: "lesson_assessments_lesson_id_lesson_id_fk"
		}).onDelete("cascade"),
]);

export const pitchingAssessment = pgTable("pitching_assessment", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	playerId: uuid("player_id").notNull(),
	coachId: uuid("coach_id").notNull(),
	lessonId: uuid("lesson_id").notNull(),
	notes: text(),
	upper: text(),
	mid: text(),
	lower: text(),
	veloMound2Oz: real("velo_mound_2oz"),
	veloMound4Oz: real("velo_mound_4oz"),
	veloMound5Oz: real("velo_mound_5oz"),
	veloMound6Oz: real("velo_mound_6oz"),
	veloPullDown2Oz: real("velo_pull_down_2oz"),
	veloPullDown4Oz: real("velo_pull_down_4oz"),
	veloPullDown5Oz: real("velo_pull_down_5oz"),
	veloPullDown6Oz: real("velo_pull_down_6oz"),
	strikePct: real("strike_pct"),
	goals: text(),
	lastTimePitched: dateRange("last_time_pitched"),
	nextTimePitched: dateRange("next_time_pitched"),
	feel: real(),
	concerns: text(),
	createdOn: timestamp("created_on", { mode: 'string' }).defaultNow().notNull(),
	lessonDate: timestamp("lesson_date", { mode: 'string' }),
}, (table) => [
	index("pitching_assessment_lesson_idx").using("btree", table.lessonId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.lessonId],
			foreignColumns: [lesson.id],
			name: "pitching_assessment_lesson_id_lesson_id_fk"
		}).onDelete("cascade"),
]);

export const hittingAssessment = pgTable("hitting_assessment", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	playerId: uuid("player_id").notNull(),
	coachId: uuid("coach_id").notNull(),
	lessonId: uuid("lesson_id").notNull(),
	notes: text(),
	upper: text(),
	lower: text(),
	head: text(),
	load: text(),
	maxEv: real("max_ev"),
	lineDrivePct: real("line_drive_pct"),
	createdOn: timestamp("created_on", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("hitting_assessment_lesson_idx").using("btree", table.lessonId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.lessonId],
			foreignColumns: [lesson.id],
			name: "hitting_assessment_lesson_id_lesson_id_fk"
		}).onDelete("cascade"),
]);

export const externalSystemsConfig = pgTable("external_systems_config", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	system: externalSystem().notNull(),
	syncEnabled: boolean("sync_enabled").default(true),
	syncFrequency: text("sync_frequency").default('daily'),
	lastSyncAt: timestamp("last_sync_at", { mode: 'string' }),
	lastSyncStatus: text("last_sync_status"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("external_systems_config_system_unique").on(table.system),
]);

export const externalSystemsTokens = pgTable("external_systems_tokens", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	system: externalSystem().notNull(),
	accessToken: text("access_token").notNull(),
	refreshToken: text("refresh_token"),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("external_systems_tokens_system_unique").on(table.system),
]);

export const armcareExams = pgTable("armcare_exams", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	playerId: uuid("player_id").notNull(),
	externalExamId: text("external_exam_id").notNull(),
	examDate: date("exam_date").notNull(),
	examTime: time("exam_time"),
	examType: text("exam_type"),
	timezone: text(),
	armScore: numeric("arm_score"),
	totalStrength: numeric("total_strength"),
	shoulderBalance: numeric("shoulder_balance"),
	velo: numeric(),
	svr: numeric(),
	totalStrengthPost: numeric("total_strength_post"),
	postStrengthLoss: numeric("post_strength_loss"),
	totalPercentFresh: numeric("total_percent_fresh"),
	rawData: jsonb("raw_data").notNull(),
	syncedAt: timestamp("synced_at", { mode: 'string' }).defaultNow().notNull(),
	syncLogId: uuid("sync_log_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("armcare_exams_date_idx").using("btree", table.examDate.asc().nullsLast().op("date_ops")),
	index("armcare_exams_player_idx").using("btree", table.playerId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [playerInformation.id],
			name: "armcare_exams_player_id_player_information_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.syncLogId],
			foreignColumns: [externalSyncLogs.id],
			name: "armcare_exams_sync_log_id_external_sync_logs_id_fk"
		}),
	unique("armcare_exams_external_exam_id_unique").on(table.externalExamId),
]);

export const externalSyncLogs = pgTable("external_sync_logs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	system: externalSystem().notNull(),
	status: syncStatus().notNull(),
	recordsCreated: integer("records_created").default(0),
	recordsUpdated: integer("records_updated").default(0),
	recordsSkipped: integer("records_skipped").default(0),
	recordsFailed: integer("records_failed").default(0),
	playersMatched: integer("players_matched").default(0),
	playersUnmatched: integer("players_unmatched").default(0),
	newMatchSuggestions: integer("new_match_suggestions").default(0),
	startedAt: timestamp("started_at", { mode: 'string' }).notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
	duration: integer(),
	errors: jsonb(),
	triggeredBy: text("triggered_by"),
	triggeredByUserId: uuid("triggered_by_user_id"),
}, (table) => [
	index("sync_logs_system_idx").using("btree", table.system.asc().nullsLast().op("enum_ops")),
	foreignKey({
			columns: [table.triggeredByUserId],
			foreignColumns: [user.id],
			name: "external_sync_logs_triggered_by_user_id_user_id_fk"
		}),
]);

export const armcareExamsUnmatched = pgTable("armcare_exams_unmatched", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	externalExamId: text("external_exam_id").notNull(),
	externalPlayerId: text("external_player_id").notNull(),
	externalEmail: text("external_email"),
	externalFirstName: text("external_first_name"),
	externalLastName: text("external_last_name"),
	examDate: date("exam_date").notNull(),
	examTime: time("exam_time"),
	examType: text("exam_type"),
	timezone: text(),
	armScore: numeric("arm_score"),
	totalStrength: numeric("total_strength"),
	shoulderBalance: numeric("shoulder_balance"),
	velo: numeric(),
	svr: numeric(),
	totalStrengthPost: numeric("total_strength_post"),
	postStrengthLoss: numeric("post_strength_loss"),
	totalPercentFresh: numeric("total_percent_fresh"),
	rawData: jsonb("raw_data").notNull(),
	matchAttempts: integer("match_attempts").default(0),
	lastMatchAttempt: timestamp("last_match_attempt", { mode: 'string' }),
	matchErrors: jsonb("match_errors"),
	syncedAt: timestamp("synced_at", { mode: 'string' }).defaultNow().notNull(),
	syncLogId: uuid("sync_log_id"),
	status: text().default('pending').notNull(),
	resolvedAt: timestamp("resolved_at", { mode: 'string' }),
	resolvedBy: uuid("resolved_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("armcare_exams_unmatched_player_idx").using("btree", table.externalPlayerId.asc().nullsLast().op("text_ops")),
	index("armcare_exams_unmatched_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.syncLogId],
			foreignColumns: [externalSyncLogs.id],
			name: "armcare_exams_unmatched_sync_log_id_external_sync_logs_id_fk"
		}),
	foreignKey({
			columns: [table.resolvedBy],
			foreignColumns: [user.id],
			name: "armcare_exams_unmatched_resolved_by_user_id_fk"
		}),
	unique("armcare_exams_unmatched_external_exam_id_unique").on(table.externalExamId),
]);

export const externalAthleteIds = pgTable("external_athlete_ids", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	playerId: uuid("player_id").notNull(),
	externalSystem: externalSystem("external_system").notNull(),
	externalId: text("external_id").notNull(),
	externalEmail: text("external_email"),
	linkingMethod: linkingMethod("linking_method").notNull(),
	linkingStatus: linkingStatus("linking_status").default('active').notNull(),
	confidence: numeric(),
	externalMetadata: jsonb("external_metadata"),
	linkedBy: uuid("linked_by"),
	linkedAt: timestamp("linked_at", { mode: 'string' }).defaultNow().notNull(),
	verifiedAt: timestamp("verified_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("external_athlete_ids_player_idx").using("btree", table.playerId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("external_athlete_ids_unique_idx").using("btree", table.externalSystem.asc().nullsLast().op("text_ops"), table.externalId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [playerInformation.id],
			name: "external_athlete_ids_player_id_player_information_id_fk"
		}),
	foreignKey({
			columns: [table.linkedBy],
			foreignColumns: [user.id],
			name: "external_athlete_ids_linked_by_user_id_fk"
		}),
]);

export const veloAssessment = pgTable("velo_assessment", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	playerId: uuid("player_id").notNull(),
	coachId: uuid("coach_id").notNull(),
	lessonId: uuid("lesson_id").notNull(),
	intent: integer(),
	avgVelo: real("avg_velo"),
	topVelo: real("top_velo"),
	strikePct: real("strike_pct"),
	createdOn: date("created_on").defaultNow().notNull(),
	lessonDate: date("lesson_date"),
}, (table) => [
	index("velo_assessment_lesson_idx").using("btree", table.lessonId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.lessonId],
			foreignColumns: [lesson.id],
			name: "velo_assessment_lesson_id_lesson_id_fk"
		}).onDelete("cascade"),
]);

export const writeupLog = pgTable("writeup_log", {
	id: serial().primaryKey().notNull(),
	playerId: uuid("player_id").notNull(),
	writeupType: varchar("writeup_type", { length: 50 }).notNull(),
	writeupDate: date("writeup_date").notNull(),
	coachId: uuid("coach_id"),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("writeup_log_coach_id_idx").using("btree", table.coachId.asc().nullsLast().op("uuid_ops")),
	index("writeup_log_date_idx").using("btree", table.writeupDate.asc().nullsLast().op("date_ops")),
	index("writeup_log_player_id_idx").using("btree", table.playerId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [playerInformation.id],
			name: "writeup_log_player_id_player_information_id_fk"
		}),
	foreignKey({
			columns: [table.coachId],
			foreignColumns: [user.id],
			name: "writeup_log_coach_id_user_id_fk"
		}),
]);

export const allowedUsers = pgTable("allowed_users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	provider: authProvider().notNull(),
	status: allowedUserStatus().default('invited').notNull(),
	organizationId: uuid("organization_id").notNull(),
	role: varchar({ length: 50 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	uniqueIndex("allowed_users_org_provider_email_uniq").using("btree", table.organizationId.asc().nullsLast().op("text_ops"), table.provider.asc().nullsLast().op("text_ops"), table.email.asc().nullsLast().op("text_ops")),
]);

export const hawkinsCmj = pgTable("hawkins_cmj", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	externalUniqueId: text("external_unique_id").notNull(),
	athleteId: text("athlete_id").notNull(),
	athleteName: text("athlete_name"),
	testTypeName: text("test_type_name").notNull(),
	testTypeCanonicalId: text("test_type_canonical_id").notNull(),
	rawData: jsonb("raw_data").notNull(),
	ingestedAt: timestamp("ingested_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	jumpHeightM: numeric("jump_height_m"),
	peakPropulsivePowerW: numeric("peak_propulsive_power_w"),
	avgPropulsiveVelocityMS: numeric("avg_propulsive_velocity_m_s"),
	propulsiveImpulseNS: numeric("propulsive_impulse_n_s"),
	p1PropulsiveImpulseNS: numeric("p1_propulsive_impulse_n_s"),
	p2PropulsiveImpulseNS: numeric("p2_propulsive_impulse_n_s"),
	p1P2PropulsiveImpulseIndex: numeric("p1p2_propulsive_impulse_index"),
	attemptKey: text("attempt_key"),
}, (table) => [
	uniqueIndex("hawkins_cmj_unique_attempt").using("btree", table.athleteId.asc().nullsLast().op("text_ops"), table.timestamp.asc().nullsLast().op("text_ops"), table.attemptKey.asc().nullsLast().op("text_ops")),
]);

export const hawkinsDropJump = pgTable("hawkins_drop_jump", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	externalUniqueId: text("external_unique_id").notNull(),
	athleteId: text("athlete_id").notNull(),
	athleteName: text("athlete_name"),
	testTypeName: text("test_type_name").notNull(),
	testTypeCanonicalId: text("test_type_canonical_id").notNull(),
	rawData: jsonb("raw_data").notNull(),
	ingestedAt: timestamp("ingested_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	mrsi: numeric(),
	attemptKey: text("attempt_key"),
}, (table) => [
	uniqueIndex("hawkins_drop_jump_unique_attempt").using("btree", table.athleteId.asc().nullsLast().op("text_ops"), table.timestamp.asc().nullsLast().op("text_ops"), table.attemptKey.asc().nullsLast().op("text_ops")),
]);

export const hawkinsIso = pgTable("hawkins_iso", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	externalUniqueId: text("external_unique_id").notNull(),
	athleteId: text("athlete_id").notNull(),
	athleteName: text("athlete_name"),
	testTypeName: text("test_type_name").notNull(),
	testTypeCanonicalId: text("test_type_canonical_id").notNull(),
	rawData: jsonb("raw_data").notNull(),
	ingestedAt: timestamp("ingested_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	lengthOfPullS: numeric("length_of_pull_s"),
	timeToPeakForceS: numeric("time_to_peak_force_s"),
	peakForceN: numeric("peak_force_n"),
	attemptKey: text("attempt_key"),
}, (table) => [
	uniqueIndex("hawkins_iso_unique_attempt").using("btree", table.athleteId.asc().nullsLast().op("text_ops"), table.timestamp.asc().nullsLast().op("text_ops"), table.attemptKey.asc().nullsLast().op("text_ops")),
]);

export const hawkinsMulti = pgTable("hawkins_multi", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	externalUniqueId: text("external_unique_id").notNull(),
	athleteId: text("athlete_id").notNull(),
	athleteName: text("athlete_name"),
	testTypeName: text("test_type_name").notNull(),
	testTypeCanonicalId: text("test_type_canonical_id").notNull(),
	rawData: jsonb("raw_data").notNull(),
	ingestedAt: timestamp("ingested_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	avgMrsi: numeric("avg_mrsi"),
	attemptKey: text("attempt_key"),
}, (table) => [
	uniqueIndex("hawkins_multi_unique_attempt").using("btree", table.athleteId.asc().nullsLast().op("text_ops"), table.timestamp.asc().nullsLast().op("text_ops"), table.attemptKey.asc().nullsLast().op("text_ops")),
]);

export const hawkinsTsIso = pgTable("hawkins_ts_iso", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	externalUniqueId: text("external_unique_id").notNull(),
	athleteId: text("athlete_id").notNull(),
	athleteName: text("athlete_name"),
	testTypeName: text("test_type_name").notNull(),
	testTypeCanonicalId: text("test_type_canonical_id").notNull(),
	rawData: jsonb("raw_data").notNull(),
	ingestedAt: timestamp("ingested_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	peakForceN: numeric("peak_force_n"),
	attemptKey: text("attempt_key"),
}, (table) => [
	uniqueIndex("hawkins_ts_iso_unique_attempt").using("btree", table.athleteId.asc().nullsLast().op("text_ops"), table.timestamp.asc().nullsLast().op("text_ops"), table.attemptKey.asc().nullsLast().op("text_ops")),
]);

export const lessonMechanics = pgTable("lesson_mechanics", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	lessonId: uuid("lesson_id").notNull(),
	playerId: uuid("player_id").notNull(),
	mechanicId: uuid("mechanic_id").notNull(),
	notes: text(),
}, (table) => [
	index("lesson_mechanics_lesson_idx").using("btree", table.lessonId.asc().nullsLast().op("uuid_ops")),
	index("lesson_mechanics_mechanic_idx").using("btree", table.mechanicId.asc().nullsLast().op("uuid_ops")),
	index("lesson_mechanics_player_idx").using("btree", table.playerId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.lessonId],
			foreignColumns: [lesson.id],
			name: "lesson_mechanics_lesson_id_lesson_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [playerInformation.id],
			name: "lesson_mechanics_player_id_player_information_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.mechanicId],
			foreignColumns: [mechanics.id],
			name: "lesson_mechanics_mechanic_id_mechanics_id_fk"
		}).onDelete("cascade"),
]);

export const mechanics = pgTable("mechanics", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 1000 }),
	type: mechanicType().notNull(),
	tags: varchar({ length: 255 }).array(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const lessonPlayers = pgTable("lesson_players", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	lessonId: uuid("lesson_id").notNull(),
	playerId: uuid("player_id").notNull(),
	notes: text(),
}, (table) => [
	index("lesson_players_lesson_idx").using("btree", table.lessonId.asc().nullsLast().op("uuid_ops")),
	index("lesson_players_player_idx").using("btree", table.playerId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.lessonId],
			foreignColumns: [lesson.id],
			name: "lesson_players_lesson_id_lesson_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [playerInformation.id],
			name: "lesson_players_player_id_player_information_id_fk"
		}).onDelete("cascade"),
]);

export const pitchingLessonPlayers = pgTable("pitching_lesson_players", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	lessonPlayerId: uuid("lesson_player_id").notNull(),
	phase: text().notNull(),
	pitchCount: integer("pitch_count"),
	intentPercent: integer("intent_percent"),
}, (table) => [
	index("pitching_lesson_players_lp_idx").using("btree", table.lessonPlayerId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.lessonPlayerId],
			foreignColumns: [lessonPlayers.id],
			name: "pitching_lesson_players_lesson_player_id_lesson_players_id_fk"
		}).onDelete("cascade"),
]);

export const athleteCohorts = pgTable("athlete_cohorts", {
	athleteId: uuid("athlete_id").notNull(),
	cohortId: uuid("cohort_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [playerInformation.id],
			name: "athlete_cohorts_athlete_id_player_information_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.cohortId],
			foreignColumns: [cohortDefinitions.id],
			name: "athlete_cohorts_cohort_id_cohort_definitions_id_fk"
		}).onDelete("cascade"),
]);

export const cohortDefinitions = pgTable("cohort_definitions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const athleteContextFlags = pgTable("athlete_context_flags", {
	athleteId: uuid("athlete_id").notNull(),
	contextType: text("context_type").notNull(),
	startDate: date("start_date").notNull(),
	endDate: date("end_date"),
	notes: text(),
}, (table) => [
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [playerInformation.id],
			name: "athlete_context_flags_athlete_id_player_information_id_fk"
		}).onDelete("cascade"),
]);

export const athleteMetricSnapshots = pgTable("athlete_metric_snapshots", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	athleteId: uuid("athlete_id").notNull(),
	metricId: uuid("metric_id").notNull(),
	rawValue: real("raw_value").notNull(),
	normalizedValue: real("normalized_value"),
	recordedAt: date("recorded_at").notNull(),
	sourceTable: text("source_table"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [playerInformation.id],
			name: "athlete_metric_snapshots_athlete_id_player_information_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.metricId],
			foreignColumns: [metricDefinitions.id],
			name: "athlete_metric_snapshots_metric_id_metric_definitions_id_fk"
		}),
]);

export const metricDefinitions = pgTable("metric_definitions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	system: text().notNull(),
	metricKey: text("metric_key").notNull(),
	displayName: text("display_name").notNull(),
	unit: text(),
	higherIsBetter: boolean("higher_is_better").default(true).notNull(),
	category: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const cohortMetricStats = pgTable("cohort_metric_stats", {
	cohortId: uuid("cohort_id").notNull(),
	metricId: uuid("metric_id").notNull(),
	p10: real(),
	p25: real(),
	p50: real(),
	p75: real(),
	p90: real(),
	mean: real(),
	stddev: real(),
	calculatedAt: timestamp("calculated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.cohortId],
			foreignColumns: [cohortDefinitions.id],
			name: "cohort_metric_stats_cohort_id_cohort_definitions_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.metricId],
			foreignColumns: [metricDefinitions.id],
			name: "cohort_metric_stats_metric_id_metric_definitions_id_fk"
		}),
]);

export const computedScores = pgTable("computed_scores", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	athleteId: uuid("athlete_id").notNull(),
	scoreType: text("score_type").notNull(),
	scoreValue: real("score_value").notNull(),
	version: text().notNull(),
	calculatedAt: timestamp("calculated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [playerInformation.id],
			name: "computed_scores_athlete_id_player_information_id_fk"
		}).onDelete("cascade"),
]);

export const metricWeights = pgTable("metric_weights", {
	metricId: uuid("metric_id").notNull(),
	scoreType: text("score_type").notNull(),
	weight: real().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.metricId],
			foreignColumns: [metricDefinitions.id],
			name: "metric_weights_metric_id_metric_definitions_id_fk"
		}),
]);

export const athleteEvents = pgTable("athlete_events", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	athleteId: uuid("athlete_id").notNull(),
	eventType: text("event_type").notNull(),
	eventDate: date("event_date").notNull(),
	label: text().notNull(),
	metadata: jsonb(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [playerInformation.id],
			name: "athlete_events_athlete_id_player_information_id_fk"
		}).onDelete("cascade"),
]);

export const metricSources = pgTable("metric_sources", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	metricId: uuid("metric_id").notNull(),
	system: text().notNull(),
	sourceTable: text("source_table").notNull(),
	sourceField: text("source_field").notNull(),
	reliability: real(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.metricId],
			foreignColumns: [metricDefinitions.id],
			name: "metric_sources_metric_id_metric_definitions_id_fk"
		}).onDelete("cascade"),
]);

export const playerPositions = pgTable("player_positions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	playerId: uuid("player_id").notNull(),
	positionId: uuid("position_id").notNull(),
	isPrimary: boolean("is_primary").default(false).notNull(),
	notes: text(),
}, (table) => [
	foreignKey({
			columns: [table.playerId],
			foreignColumns: [playerInformation.id],
			name: "player_positions_player_id_player_information_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.positionId],
			foreignColumns: [positions.id],
			name: "player_positions_position_id_positions_id_fk"
		}).onDelete("cascade"),
]);

export const positions = pgTable("positions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	code: text().notNull(),
	name: text().notNull(),
	group: text().notNull(),
	isResolvable: boolean("is_resolvable").default(true).notNull(),
}, (table) => [
	unique("positions_code_unique").on(table.code),
]);

export const manualTsIso = pgTable("manual_ts_iso", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	lessonPlayerId: uuid("lesson_player_id").notNull(),
	shoulderErL: real("shoulder_er_l"),
	shoulderErR: real("shoulder_er_r"),
	shoulderErTtpfL: real("shoulder_er_ttpf_l"),
	shoulderErTtpfR: real("shoulder_er_ttpf_r"),
	shoulderIrL: real("shoulder_ir_l"),
	shoulderIrR: real("shoulder_ir_r"),
	shoulderIrTtpfL: real("shoulder_ir_ttpf_l"),
	shoulderIrTtpfR: real("shoulder_ir_ttpf_r"),
	shoulderRotL: real("shoulder_rot_l"),
	shoulderRotR: real("shoulder_rot_r"),
	shoulderRotRfdL: real("shoulder_rot_rfd_l"),
	shoulderRotRfdR: real("shoulder_rot_rfd_r"),
	hipRotL: real("hip_rot_l"),
	hipRotR: real("hip_rot_r"),
	hipRotRfdL: real("hip_rot_rfd_l"),
	hipRotRfdR: real("hip_rot_rfd_r"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.lessonPlayerId],
			foreignColumns: [lessonPlayers.id],
			name: "manual_ts_iso_lesson_player_id_lesson_players_id_fk"
		}).onDelete("cascade"),
]);
