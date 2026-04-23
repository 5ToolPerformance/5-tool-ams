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
  playerInjuries,
  smfaBoolean,
  trueStrength,
  users,
  veloAssessment,
  writeupLog,
  writeups,
} from "@/db/schema";

export type UserSelect = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
export type PlayerSelect = typeof playerInformation.$inferSelect;
export type PlayerInsert = typeof playerInformation.$inferInsert;
export type ArmCareSelect = typeof armCare.$inferSelect;
export type ArmCareInsert = typeof armCare.$inferInsert;
export type SmfaSelect = typeof smfaBoolean.$inferSelect;
export type SmfaInsert = typeof smfaBoolean.$inferInsert;
export type ForcePlateSelect = typeof hawkinsForcePlate.$inferSelect;
export type ForcePlateInsert = typeof hawkinsForcePlate.$inferInsert;
export type TrueStrengthSelect = typeof trueStrength.$inferSelect;
export type TrueStrengthInsert = typeof trueStrength.$inferInsert;
export type LessonSelect = typeof lesson.$inferSelect;
export type LessonInsert = typeof lesson.$inferInsert;
export type MotorPreferencesSelect = typeof motorPreferences.$inferSelect;
export type MotorPreferencesInsert = typeof motorPreferences.$inferInsert;
export type HittingAssessmentSelect = typeof hittingAssessment.$inferSelect;
export type HittingAssessmentInsert = typeof hittingAssessment.$inferInsert;
export type PitchingAssessmentSelect = typeof pitchingAssessment.$inferSelect;
export type PitchingAssessmentInsert = typeof pitchingAssessment.$inferInsert;
export type VeloAssessmentSelect = typeof veloAssessment.$inferSelect;
export type VeloAssessmentInsert = typeof veloAssessment.$inferInsert;
export type HitTraxAssessmentSelect = typeof hitTraxAssessment.$inferSelect;
export type HitTraxAssessmentInsert = typeof hitTraxAssessment.$inferInsert;
export type FieldingAssessmentSelect = typeof fieldingAssessment.$inferSelect;
export type FieldingAssessmentInsert = typeof fieldingAssessment.$inferInsert;
export type CatchingAssessmentSelect = typeof catchingAssessment.$inferSelect;
export type CatchingAssessmentInsert = typeof catchingAssessment.$inferInsert;
export type WriteupSelect = typeof writeups.$inferSelect;
export type WriteupInsert = typeof writeups.$inferInsert;
export type PlayerInjurySelect = typeof playerInjuries.$inferSelect;
export type PlayerInjuryInsert = typeof playerInjuries.$inferInsert;
export type WriteupLogSelect = typeof writeupLog.$inferSelect;
export type WriteupLogInsert = typeof writeupLog.$inferInsert;

export type AssessmentDataSelect =
  | ArmCareSelect
  | SmfaSelect
  | ForcePlateSelect
  | TrueStrengthSelect
  | PitchingAssessmentSelect
  | VeloAssessmentSelect
  | HitTraxAssessmentSelect
  | FieldingAssessmentSelect;
