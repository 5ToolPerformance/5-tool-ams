import {
  armCare,
  hawkinsForcePlate,
  lesson,
  smfa,
  trueStrength,
} from "@/db/schema";

// ArmCare Db schema types
export type ArmCareSelect = typeof armCare.$inferSelect;
export type ArmCareInsert = typeof armCare.$inferInsert;

// SMFA Db schema types
export type SmfaSelect = typeof smfa.$inferSelect;
export type SmfaInsert = typeof smfa.$inferInsert;

// ForcePlate Db schema types
export type ForcePlateSelect = typeof hawkinsForcePlate.$inferSelect;
export type ForcePlateInsert = typeof hawkinsForcePlate.$inferInsert;

// TrueStrength Db schema types
export type TrueStrengthSelect = typeof trueStrength.$inferSelect;
export type TrueStrengthInsert = typeof trueStrength.$inferInsert;

// Lesson Db schema types
export type LessonSelect = typeof lesson.$inferSelect;
export type LessonInsert = typeof lesson.$inferInsert;
