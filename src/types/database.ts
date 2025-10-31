import {
  armCare,
  catchingAssessment,
  fieldingAssessment,
  hawkinsForcePlate,
  hitTraxAssessment,
  hittingAssessment,
  lesson,
  motorPreferences,
  pitchingAssessment,
  playerInformation,
  smfaBoolean,
  trueStrength,
  users,
  veloAssessment,
  writeups,
} from "@/db/schema";

// User Db schema types
export type UserSelect = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

// Player Db schema types
export type PlayerSelect = typeof playerInformation.$inferSelect;
export type PlayerInsert = typeof playerInformation.$inferInsert;

// ArmCare Db schema types
export type ArmCareSelect = typeof armCare.$inferSelect;
export type ArmCareInsert = typeof armCare.$inferInsert;

// SMFA Db schema types
export type SmfaSelect = typeof smfaBoolean.$inferSelect;
export type SmfaInsert = typeof smfaBoolean.$inferInsert;

// ForcePlate Db schema types
export type ForcePlateSelect = typeof hawkinsForcePlate.$inferSelect;
export type ForcePlateInsert = typeof hawkinsForcePlate.$inferInsert;

// TrueStrength Db schema types
export type TrueStrengthSelect = typeof trueStrength.$inferSelect;
export type TrueStrengthInsert = typeof trueStrength.$inferInsert;

// Lesson Db schema types
export type LessonSelect = typeof lesson.$inferSelect;
export type LessonInsert = typeof lesson.$inferInsert;

// Motor Preferences Db schema types
export type MotorPreferencesSelect = typeof motorPreferences.$inferSelect;
export type MotorPreferencesInsert = typeof motorPreferences.$inferInsert;

// Hitting Assessment Db schema types
export type HittingAssessmentSelect = typeof hittingAssessment.$inferSelect;
export type HittingAssessmentInsert = typeof hittingAssessment.$inferInsert;

// Pitching Assessment Db schema types
export type PitchingAssessmentSelect = typeof pitchingAssessment.$inferSelect;
export type PitchingAssessmentInsert = typeof pitchingAssessment.$inferInsert;

// Velo Assessment Db schema types
export type VeloAssessmentSelect = typeof veloAssessment.$inferSelect;
export type VeloAssessmentInsert = typeof veloAssessment.$inferInsert;

// HitTrax Assessment Db schema types
export type HitTraxAssessmentSelect = typeof hitTraxAssessment.$inferSelect;
export type HitTraxAssessmentInsert = typeof hitTraxAssessment.$inferInsert;

// Fielding Assessment Db schema types
export type FieldingAssessmentSelect = typeof fieldingAssessment.$inferSelect;
export type FieldingAssessmentInsert = typeof fieldingAssessment.$inferInsert;

// Catching Assessment Db schema types
export type CatchingAssessmentSelect = typeof catchingAssessment.$inferSelect;
export type CatchingAssessmentInsert = typeof catchingAssessment.$inferInsert;

// Writeup Db schema types
export type WriteupSelect = typeof writeups.$inferSelect;
export type WriteupInsert = typeof writeups.$inferInsert;
