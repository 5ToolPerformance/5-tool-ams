import { relations } from "drizzle-orm/relations";

import armCare from "./assessments/arm-care";
import hawkinsForcePlate from "./assessments/hawkins-force-plate";
import smfa from "./assessments/smfa";
import trueStrength from "./assessments/true-strength";
import lesson from "./lesson";
import users from "./users";

export { default as accounts } from "./accounts";
export { default as armCare } from "./assessments/arm-care";
export { default as hawkinsForcePlate } from "./assessments/hawkins-force-plate";
export { default as smfa } from "./assessments/smfa";
export { default as trueStrength } from "./assessments/true-strength";
export { default as lesson, lessonTypes } from "./lesson";
export {
  assessmentTypeEnum,
  default as lessonAssessments,
} from "./lessonAssessments";
export { default as notes } from "./notes";
export {
  default as playerInformation,
  playerInformationRelations,
} from "./playerInformation";
export { default as sessions } from "./sessions";
export { rolesEnum, default as users, usersRelations } from "./users";

export const lessonRelations = relations(lesson, ({ one }) => ({
  user: one(users, {
    fields: [lesson.userId],
    references: [users.id],
    relationName: "userLessons",
  }),
  coach: one(users, {
    fields: [lesson.coachId],
    references: [users.id],
    relationName: "coachLessons",
  }),
  armCareAssessment: one(armCare, {
    fields: [lesson.armCare],
    references: [armCare.id],
  }),
  smfaAssessment: one(smfa, {
    fields: [lesson.smfa],
    references: [smfa.id],
  }),
  hawkinsForceAssessment: one(hawkinsForcePlate, {
    fields: [lesson.hawkinsForce],
    references: [hawkinsForcePlate.id],
  }),
  trueStrengthAssessment: one(trueStrength, {
    fields: [lesson.trueStrength],
    references: [trueStrength.id],
  }),
}));
