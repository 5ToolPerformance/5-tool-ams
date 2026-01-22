import { relations } from "drizzle-orm/relations";
import { user, playerInformation, account, session, notes, lesson, armCare, hawkinsForcePlate, smfa, trueStrength, smfaBoolean, playerMeasurements, fieldingAssessment, catchingAssessment, writeups, playerInjuries, hittraxAssessment, motorPreferences, lessonAssessments, pitchingAssessment, hittingAssessment, armcareExams, externalSyncLogs, armcareExamsUnmatched, externalAthleteIds, veloAssessment, writeupLog, lessonMechanics, mechanics, lessonPlayers, pitchingLessonPlayers, athleteCohorts, cohortDefinitions, athleteContextFlags, athleteMetricSnapshots, metricDefinitions, cohortMetricStats, computedScores, metricWeights, athleteEvents, metricSources, playerPositions, positions, manualTsIso } from "./schema";

export const playerInformationRelations = relations(playerInformation, ({one, many}) => ({
	user: one(user, {
		fields: [playerInformation.userId],
		references: [user.id]
	}),
	lessons: many(lesson),
	playerMeasurements: many(playerMeasurements),
	writeups: many(writeups),
	playerInjuries: many(playerInjuries),
	motorPreferences: many(motorPreferences),
	armcareExams: many(armcareExams),
	externalAthleteIds: many(externalAthleteIds),
	writeupLogs: many(writeupLog),
	lessonMechanics: many(lessonMechanics),
	lessonPlayers: many(lessonPlayers),
	athleteCohorts: many(athleteCohorts),
	athleteContextFlags: many(athleteContextFlags),
	athleteMetricSnapshots: many(athleteMetricSnapshots),
	computedScores: many(computedScores),
	athleteEvents: many(athleteEvents),
	playerPositions: many(playerPositions),
}));

export const userRelations = relations(user, ({many}) => ({
	playerInformations: many(playerInformation),
	accounts: many(account),
	sessions: many(session),
	notes_userId: many(notes, {
		relationName: "notes_userId_user_id"
	}),
	notes_coachId: many(notes, {
		relationName: "notes_coachId_user_id"
	}),
	lessons: many(lesson),
	writeups: many(writeups),
	externalSyncLogs: many(externalSyncLogs),
	armcareExamsUnmatcheds: many(armcareExamsUnmatched),
	externalAthleteIds: many(externalAthleteIds),
	writeupLogs: many(writeupLog),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const notesRelations = relations(notes, ({one}) => ({
	user_userId: one(user, {
		fields: [notes.userId],
		references: [user.id],
		relationName: "notes_userId_user_id"
	}),
	user_coachId: one(user, {
		fields: [notes.coachId],
		references: [user.id],
		relationName: "notes_coachId_user_id"
	}),
}));

export const armCareRelations = relations(armCare, ({one}) => ({
	lesson: one(lesson, {
		fields: [armCare.lessonId],
		references: [lesson.id]
	}),
}));

export const lessonRelations = relations(lesson, ({one, many}) => ({
	armCares: many(armCare),
	hawkinsForcePlates: many(hawkinsForcePlate),
	smfas: many(smfa),
	trueStrengths: many(trueStrength),
	smfaBooleans: many(smfaBoolean),
	user: one(user, {
		fields: [lesson.coachId],
		references: [user.id]
	}),
	playerInformation: one(playerInformation, {
		fields: [lesson.playerId],
		references: [playerInformation.id]
	}),
	fieldingAssessments: many(fieldingAssessment),
	catchingAssessments: many(catchingAssessment),
	hittraxAssessments: many(hittraxAssessment),
	lessonAssessments: many(lessonAssessments),
	pitchingAssessments: many(pitchingAssessment),
	hittingAssessments: many(hittingAssessment),
	veloAssessments: many(veloAssessment),
	lessonMechanics: many(lessonMechanics),
	lessonPlayers: many(lessonPlayers),
}));

export const hawkinsForcePlateRelations = relations(hawkinsForcePlate, ({one}) => ({
	lesson: one(lesson, {
		fields: [hawkinsForcePlate.lessonId],
		references: [lesson.id]
	}),
}));

export const smfaRelations = relations(smfa, ({one}) => ({
	lesson: one(lesson, {
		fields: [smfa.lessonId],
		references: [lesson.id]
	}),
}));

export const trueStrengthRelations = relations(trueStrength, ({one}) => ({
	lesson: one(lesson, {
		fields: [trueStrength.lessonId],
		references: [lesson.id]
	}),
}));

export const smfaBooleanRelations = relations(smfaBoolean, ({one}) => ({
	lesson: one(lesson, {
		fields: [smfaBoolean.lessonId],
		references: [lesson.id]
	}),
}));

export const playerMeasurementsRelations = relations(playerMeasurements, ({one}) => ({
	playerInformation: one(playerInformation, {
		fields: [playerMeasurements.playerId],
		references: [playerInformation.id]
	}),
}));

export const fieldingAssessmentRelations = relations(fieldingAssessment, ({one}) => ({
	lesson: one(lesson, {
		fields: [fieldingAssessment.lessonId],
		references: [lesson.id]
	}),
}));

export const catchingAssessmentRelations = relations(catchingAssessment, ({one}) => ({
	lesson: one(lesson, {
		fields: [catchingAssessment.lessonId],
		references: [lesson.id]
	}),
}));

export const writeupsRelations = relations(writeups, ({one}) => ({
	user: one(user, {
		fields: [writeups.coachId],
		references: [user.id]
	}),
	playerInformation: one(playerInformation, {
		fields: [writeups.playerId],
		references: [playerInformation.id]
	}),
}));

export const playerInjuriesRelations = relations(playerInjuries, ({one}) => ({
	playerInformation: one(playerInformation, {
		fields: [playerInjuries.playerId],
		references: [playerInformation.id]
	}),
}));

export const hittraxAssessmentRelations = relations(hittraxAssessment, ({one}) => ({
	lesson: one(lesson, {
		fields: [hittraxAssessment.lessonId],
		references: [lesson.id]
	}),
}));

export const motorPreferencesRelations = relations(motorPreferences, ({one}) => ({
	playerInformation: one(playerInformation, {
		fields: [motorPreferences.playerId],
		references: [playerInformation.id]
	}),
}));

export const lessonAssessmentsRelations = relations(lessonAssessments, ({one}) => ({
	lesson: one(lesson, {
		fields: [lessonAssessments.lessonId],
		references: [lesson.id]
	}),
}));

export const pitchingAssessmentRelations = relations(pitchingAssessment, ({one}) => ({
	lesson: one(lesson, {
		fields: [pitchingAssessment.lessonId],
		references: [lesson.id]
	}),
}));

export const hittingAssessmentRelations = relations(hittingAssessment, ({one}) => ({
	lesson: one(lesson, {
		fields: [hittingAssessment.lessonId],
		references: [lesson.id]
	}),
}));

export const armcareExamsRelations = relations(armcareExams, ({one}) => ({
	playerInformation: one(playerInformation, {
		fields: [armcareExams.playerId],
		references: [playerInformation.id]
	}),
	externalSyncLog: one(externalSyncLogs, {
		fields: [armcareExams.syncLogId],
		references: [externalSyncLogs.id]
	}),
}));

export const externalSyncLogsRelations = relations(externalSyncLogs, ({one, many}) => ({
	armcareExams: many(armcareExams),
	user: one(user, {
		fields: [externalSyncLogs.triggeredByUserId],
		references: [user.id]
	}),
	armcareExamsUnmatcheds: many(armcareExamsUnmatched),
}));

export const armcareExamsUnmatchedRelations = relations(armcareExamsUnmatched, ({one}) => ({
	externalSyncLog: one(externalSyncLogs, {
		fields: [armcareExamsUnmatched.syncLogId],
		references: [externalSyncLogs.id]
	}),
	user: one(user, {
		fields: [armcareExamsUnmatched.resolvedBy],
		references: [user.id]
	}),
}));

export const externalAthleteIdsRelations = relations(externalAthleteIds, ({one}) => ({
	playerInformation: one(playerInformation, {
		fields: [externalAthleteIds.playerId],
		references: [playerInformation.id]
	}),
	user: one(user, {
		fields: [externalAthleteIds.linkedBy],
		references: [user.id]
	}),
}));

export const veloAssessmentRelations = relations(veloAssessment, ({one}) => ({
	lesson: one(lesson, {
		fields: [veloAssessment.lessonId],
		references: [lesson.id]
	}),
}));

export const writeupLogRelations = relations(writeupLog, ({one}) => ({
	playerInformation: one(playerInformation, {
		fields: [writeupLog.playerId],
		references: [playerInformation.id]
	}),
	user: one(user, {
		fields: [writeupLog.coachId],
		references: [user.id]
	}),
}));

export const lessonMechanicsRelations = relations(lessonMechanics, ({one}) => ({
	lesson: one(lesson, {
		fields: [lessonMechanics.lessonId],
		references: [lesson.id]
	}),
	playerInformation: one(playerInformation, {
		fields: [lessonMechanics.playerId],
		references: [playerInformation.id]
	}),
	mechanic: one(mechanics, {
		fields: [lessonMechanics.mechanicId],
		references: [mechanics.id]
	}),
}));

export const mechanicsRelations = relations(mechanics, ({many}) => ({
	lessonMechanics: many(lessonMechanics),
}));

export const lessonPlayersRelations = relations(lessonPlayers, ({one, many}) => ({
	lesson: one(lesson, {
		fields: [lessonPlayers.lessonId],
		references: [lesson.id]
	}),
	playerInformation: one(playerInformation, {
		fields: [lessonPlayers.playerId],
		references: [playerInformation.id]
	}),
	pitchingLessonPlayers: many(pitchingLessonPlayers),
	manualTsIsos: many(manualTsIso),
}));

export const pitchingLessonPlayersRelations = relations(pitchingLessonPlayers, ({one}) => ({
	lessonPlayer: one(lessonPlayers, {
		fields: [pitchingLessonPlayers.lessonPlayerId],
		references: [lessonPlayers.id]
	}),
}));

export const athleteCohortsRelations = relations(athleteCohorts, ({one}) => ({
	playerInformation: one(playerInformation, {
		fields: [athleteCohorts.athleteId],
		references: [playerInformation.id]
	}),
	cohortDefinition: one(cohortDefinitions, {
		fields: [athleteCohorts.cohortId],
		references: [cohortDefinitions.id]
	}),
}));

export const cohortDefinitionsRelations = relations(cohortDefinitions, ({many}) => ({
	athleteCohorts: many(athleteCohorts),
	cohortMetricStats: many(cohortMetricStats),
}));

export const athleteContextFlagsRelations = relations(athleteContextFlags, ({one}) => ({
	playerInformation: one(playerInformation, {
		fields: [athleteContextFlags.athleteId],
		references: [playerInformation.id]
	}),
}));

export const athleteMetricSnapshotsRelations = relations(athleteMetricSnapshots, ({one}) => ({
	playerInformation: one(playerInformation, {
		fields: [athleteMetricSnapshots.athleteId],
		references: [playerInformation.id]
	}),
	metricDefinition: one(metricDefinitions, {
		fields: [athleteMetricSnapshots.metricId],
		references: [metricDefinitions.id]
	}),
}));

export const metricDefinitionsRelations = relations(metricDefinitions, ({many}) => ({
	athleteMetricSnapshots: many(athleteMetricSnapshots),
	cohortMetricStats: many(cohortMetricStats),
	metricWeights: many(metricWeights),
	metricSources: many(metricSources),
}));

export const cohortMetricStatsRelations = relations(cohortMetricStats, ({one}) => ({
	cohortDefinition: one(cohortDefinitions, {
		fields: [cohortMetricStats.cohortId],
		references: [cohortDefinitions.id]
	}),
	metricDefinition: one(metricDefinitions, {
		fields: [cohortMetricStats.metricId],
		references: [metricDefinitions.id]
	}),
}));

export const computedScoresRelations = relations(computedScores, ({one}) => ({
	playerInformation: one(playerInformation, {
		fields: [computedScores.athleteId],
		references: [playerInformation.id]
	}),
}));

export const metricWeightsRelations = relations(metricWeights, ({one}) => ({
	metricDefinition: one(metricDefinitions, {
		fields: [metricWeights.metricId],
		references: [metricDefinitions.id]
	}),
}));

export const athleteEventsRelations = relations(athleteEvents, ({one}) => ({
	playerInformation: one(playerInformation, {
		fields: [athleteEvents.athleteId],
		references: [playerInformation.id]
	}),
}));

export const metricSourcesRelations = relations(metricSources, ({one}) => ({
	metricDefinition: one(metricDefinitions, {
		fields: [metricSources.metricId],
		references: [metricDefinitions.id]
	}),
}));

export const playerPositionsRelations = relations(playerPositions, ({one}) => ({
	playerInformation: one(playerInformation, {
		fields: [playerPositions.playerId],
		references: [playerInformation.id]
	}),
	position: one(positions, {
		fields: [playerPositions.positionId],
		references: [positions.id]
	}),
}));

export const positionsRelations = relations(positions, ({many}) => ({
	playerPositions: many(playerPositions),
}));

export const manualTsIsoRelations = relations(manualTsIso, ({one}) => ({
	lessonPlayer: one(lessonPlayers, {
		fields: [manualTsIso.lessonPlayerId],
		references: [lessonPlayers.id]
	}),
}));