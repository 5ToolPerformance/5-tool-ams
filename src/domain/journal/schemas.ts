import { z } from "zod";

import {
  hittingOutcomeEnum,
  journalContextTypeEnum,
  throwIntentEnum,
  throwTypeEnum,
} from "@/db/schema";

const nullableTrimmedString = z
  .string()
  .trim()
  .max(500, "Keep this shorter")
  .transform((value) => value || null)
  .nullable()
  .optional()
  .transform((value) => value ?? null);

const nullableShortString = z
  .string()
  .trim()
  .max(120, "Keep this shorter")
  .transform((value) => value || null)
  .nullable()
  .optional()
  .transform((value) => value ?? null);

const nullableScore = z
  .union([z.number(), z.string()])
  .optional()
  .nullable()
  .transform((value) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    const parsed = typeof value === "number" ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : value;
  })
  .pipe(z.number().int().min(1).max(5).nullable());

const nullableInteger = z
  .union([z.number(), z.string()])
  .optional()
  .nullable()
  .transform((value) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    const parsed = typeof value === "number" ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : value;
  })
  .pipe(z.number().int().min(0).nullable());

const nullableReal = z
  .union([z.number(), z.string()])
  .optional()
  .nullable()
  .transform((value) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    const parsed = typeof value === "number" ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : value;
  })
  .pipe(z.number().min(0).nullable());

export const journalBaseSchema = z.object({
  playerId: z.string().uuid("Player is required"),
  entryDate: z.string().date("Entry date is required"),
  contextType: z
    .enum(journalContextTypeEnum.enumValues)
    .nullable()
    .optional()
    .transform((value) => value ?? null),
  title: nullableShortString,
  summaryNote: nullableTrimmedString,
});

export const throwingWorkloadSegmentSchema = z.object({
  throwType: z.enum(throwTypeEnum.enumValues),
  throwCount: z.coerce.number().int().min(1, "Throw count must be at least 1"),
  pitchCount: nullableInteger,
  intentLevel: z
    .enum(throwIntentEnum.enumValues)
    .nullable()
    .optional()
    .transform((value) => value ?? null),
  velocityAvg: nullableReal,
  velocityMax: nullableReal,
  pitchType: nullableShortString,
  durationMinutes: nullableInteger,
  notes: nullableTrimmedString,
  isEstimated: z.coerce.boolean().optional().default(false),
});

export const throwingArmCheckinSchema = z
  .object({
    armSoreness: nullableScore,
    bodyFatigue: nullableScore,
    armFatigue: nullableScore,
    recoveryScore: nullableScore,
    feelsOff: z.boolean().nullable().optional().transform((value) => value ?? null),
    statusNote: nullableTrimmedString,
  })
  .transform((value) => {
    const hasValues = Object.values(value).some((item) => item !== null);
    return hasValues ? value : null;
  });

export const createThrowingJournalEntrySchema = journalBaseSchema.extend({
  entryType: z.literal("throwing"),
  overallFeel: nullableScore,
  confidenceScore: nullableScore,
  sessionNote: nullableTrimmedString,
  workloadSegments: z
    .array(throwingWorkloadSegmentSchema)
    .min(1, "Add at least one workload segment"),
  armCheckin: throwingArmCheckinSchema.nullable().optional().transform((value) => value ?? null),
});

export const hittingAtBatSchema = z.object({
  atBatNumber: z.coerce.number().int().min(1, "At-bat number must be at least 1"),
  outcome: z.enum(hittingOutcomeEnum.enumValues),
  resultCategory: nullableShortString,
  pitchTypeSeen: nullableShortString,
  pitchLocation: nullableShortString,
  countAtResult: nullableShortString,
  runnersInScoringPosition: z
    .boolean()
    .nullable()
    .optional()
    .transform((value) => value ?? null),
  rbi: nullableInteger,
  notes: nullableTrimmedString,
});

export const createHittingJournalEntrySchema = journalBaseSchema.extend({
  entryType: z.literal("hitting"),
  opponent: nullableShortString,
  teamName: nullableShortString,
  location: nullableShortString,
  overallFeel: nullableScore,
  confidenceScore: nullableScore,
  hittingSummaryNote: nullableTrimmedString,
  atBats: z.array(hittingAtBatSchema).min(1, "Add at least one at-bat"),
});

export const createJournalEntrySchema = z.discriminatedUnion("entryType", [
  createThrowingJournalEntrySchema,
  createHittingJournalEntrySchema,
]);

export const updateJournalEntrySchema = z.discriminatedUnion("entryType", [
  createThrowingJournalEntrySchema.extend({
    id: z.string().uuid(),
  }),
  createHittingJournalEntrySchema.extend({
    id: z.string().uuid(),
  }),
]);

export type CreateJournalEntrySchema = z.infer<typeof createJournalEntrySchema>;
export type UpdateJournalEntrySchema = z.infer<typeof updateJournalEntrySchema>;
