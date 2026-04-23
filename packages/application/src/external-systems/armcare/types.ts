import { z } from "zod";

import { BaseExternalRecord } from "../types";

/**
 * Zod schema for ArmCare API response validation
 * Provides runtime validation + TypeScript types
 */
export const ArmCareExamRowSchema = z
  .object({
    "Exam ID": z.string(),
    Email: z.string(),
    "ArmCare ID": z.string(),
    "First Name": z.string(),
    "Last Name": z.string(),
    "Exam Date": z.string(),
    "Exam Type": z.string(),
    Time: z.string(),
    Timezone: z.string(),
    Gender: z.string().optional(),
    DOB: z.string().optional(),

    // Strength metrics (can be string or number from API)
    "Arm Score": z.union([z.string(), z.number()]),
    "Total Strength": z.union([z.string(), z.number()]),
    "Shoulder Balance": z.union([z.string(), z.number()]),
    Velo: z.union([z.string(), z.number()]),
    SVR: z.union([z.string(), z.number()]),
    "Total Strength Post": z.union([z.string(), z.number()]),
    "Post Strength Loss": z.union([z.string(), z.number()]),
    "Total %Fresh": z.union([z.string(), z.number()]),

    // Allow additional fields not defined here
  })
  .passthrough();

export type ArmCareExamRow = z.infer<typeof ArmCareExamRowSchema>;

export const ArmCareAPIResponseSchema = z.object({
  playerExamsInfo: z.array(ArmCareExamRowSchema),
});

export type ArmCareAPIResponse = z.infer<typeof ArmCareAPIResponseSchema>;

/**
 * ArmCare configuration
 */
export interface ArmCareConfig {
  username: string;
  password: string;
  authUrl: string;
  apiUrl: string;
}

/**
 * Normalized exam record after transformation
 */
export interface ArmCareExamRecord extends BaseExternalRecord {
  externalId: string;
  date: string;

  // Player identifiers
  playerId: string | null;
  externalPlayerId: string;
  externalEmail: string;
  externalFirstName: string;
  externalLastName: string;

  // Exam details
  examTime: string | null;
  examType: string;
  timezone: string;

  // Normalized metrics (parsed to numbers)
  armScore: number | null;
  totalStrength: number | null;
  shoulderBalance: number | null;
  velo: number | null;
  svr: number | null;
  totalStrengthPost: number | null;
  postStrengthLoss: number | null;
  totalPercentFresh: number | null;

  // Complete raw data
  rawData: ArmCareExamRow;
}

/**
 * ArmCare authentication response
 */
export interface ArmCareAuthResponse {
  access_token: string;
  user_id: string;
  expires_in: number;
  refresh_token: string;
  role: string;
}
