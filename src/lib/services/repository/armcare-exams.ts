import { and, asc, desc, eq, isNotNull } from "drizzle-orm";

import db from "@/db";
import {
  armcareExams,
  armcareExamsUnmatched,
  externalAthleteIds,
} from "@/db/schema";

export interface UniqueUnmatchedPlayer {
  externalPlayerId: string;
  externalFirstName: string;
  externalLastName: string;
  externalEmail: string | null;
  examCount: number;
  latestExamDate: string;
  earliestExamDate: string;
  examTypes: string[];
}

/**
 * Repository for database operations related to armcare exams.
 */
export const armcareExamsRepository = {
  /**
   * Gets the unmatched exams.
   * @returns An array of unmatched exams
   * @throws Error if there is an error with the database query
   */
  getUnmatchedExams: async () => {
    try {
      const unmatched = await db.query.armcareExamsUnmatched.findMany({
        where: eq(armcareExamsUnmatched.status, "pending"),
        orderBy: desc(armcareExamsUnmatched.createdAt),
      });

      return unmatched;
    } catch (error) {
      console.error(
        "[ArmCareRepo] getUnmatchedExams - Database error: ",
        error
      );
      throw new Error("Failed to fetch unmatched exams from the database");
    }
  },

  /**
   * Gets the unmatched players.
   * @returns An array of unmatched players
   * @throws Error if there is an error with the database query
   */
  getUnmatchedPlayers: async () => {
    try {
      const unmatchedExams = await db.query.armcareExamsUnmatched.findMany({
        where: eq(armcareExamsUnmatched.status, "pending"),
        orderBy: (exams, { desc }) => [desc(exams.examDate)],
      });

      // Group by player (externalPlayerId)
      const playerMap = new Map<string, UniqueUnmatchedPlayer>();

      for (const exam of unmatchedExams) {
        const playerId = exam.externalPlayerId;

        if (!playerMap.has(playerId)) {
          playerMap.set(playerId, {
            externalPlayerId: playerId,
            externalFirstName: exam.externalFirstName || "",
            externalLastName: exam.externalLastName || "",
            externalEmail: exam.externalEmail || null,
            examCount: 0,
            latestExamDate: exam.examDate,
            earliestExamDate: exam.examDate,
            examTypes: [],
          });
        }

        const player = playerMap.get(playerId)!;
        player.examCount++;

        // Track exam types
        if (exam.examType && !player.examTypes.includes(exam.examType)) {
          player.examTypes.push(exam.examType);
        }

        // Update date range
        if (exam.examDate > player.latestExamDate) {
          player.latestExamDate = exam.examDate;
        }
        if (exam.examDate < player.earliestExamDate) {
          player.earliestExamDate = exam.examDate;
        }
      }

      // Convert map to array and sort by exam count (descending)
      return Array.from(playerMap.values()).sort(
        (a, b) => b.examCount - a.examCount
      );
    } catch (error) {
      console.error(
        "[ArmCareRepo] getUnmatchedPlayers - Database error: ",
        error
      );
      throw new Error("Failed to fetch unmatched players from the database");
    }
  },

  /**
   * Links an ArmCare player to a Path player.
   * @param externalPlayerId The external player ID
   * @param pathPlayerId The Path player ID
   * @param linkedByUserId The ID of the user who linked the player
   * @returns An object containing the result of the operation
   * @throws Error if there is an error with the database query
   */
  linkArmcarePlayer: async (
    externalPlayerId: string,
    pathPlayerId: string,
    linkedByUserId: string
  ) => {
    try {
      const unmatchedExams = await db.query.armcareExamsUnmatched.findMany({
        where: and(
          eq(armcareExamsUnmatched.externalPlayerId, externalPlayerId),
          eq(armcareExamsUnmatched.status, "pending")
        ),
      });

      if (unmatchedExams.length === 0) {
        return {
          success: false,
          examsLinked: 0,
          mappingCreated: false,
          error: "No pending exams found for this player",
        };
      }

      // Get player info from first exam
      const firstExam = unmatchedExams[0];

      // 1. Create or update mapping in external_athlete_ids
      const existingMapping = await db.query.externalAthleteIds.findFirst({
        where: and(
          eq(externalAthleteIds.playerId, pathPlayerId),
          eq(externalAthleteIds.externalSystem, "armcare")
        ),
      });

      if (existingMapping) {
        // Update existing mapping
        await db
          .update(externalAthleteIds)
          .set({
            externalId: externalPlayerId,
            externalEmail: firstExam.externalEmail,
            linkingMethod: "manual",
            linkingStatus: "active",
            confidence: "1.0",
            linkedBy: linkedByUserId,
            verifiedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .where(eq(externalAthleteIds.id, existingMapping.id));
      } else {
        // Create new mapping
        await db.insert(externalAthleteIds).values({
          playerId: pathPlayerId,
          externalSystem: "armcare",
          externalId: externalPlayerId,
          externalEmail: firstExam.externalEmail,
          linkingMethod: "manual",
          linkingStatus: "active",
          confidence: "1.0",
          linkedBy: linkedByUserId,
          linkedAt: new Date().toISOString(),
          verifiedAt: new Date().toISOString(),
        });
      }

      // 2. Move all exams to main table
      let examsLinked = 0;

      for (const exam of unmatchedExams) {
        // Insert into main table
        await db.insert(armcareExams).values({
          playerId: pathPlayerId,
          externalExamId: exam.externalExamId,
          examDate: exam.examDate,
          examTime: exam.examTime,
          examType: exam.examType,
          timezone: exam.timezone,

          armScore: exam.armScore,
          totalStrength: exam.totalStrength,
          shoulderBalance: exam.shoulderBalance,
          velo: exam.velo,
          svr: exam.svr,
          totalStrengthPost: exam.totalStrengthPost,
          postStrengthLoss: exam.postStrengthLoss,
          totalPercentFresh: exam.totalPercentFresh,

          rawData: exam.rawData,
          syncLogId: exam.syncLogId,
          syncedAt: new Date().toISOString(),
        });

        // Mark unmatched exam as resolved
        await db
          .update(armcareExamsUnmatched)
          .set({
            status: "resolved",
            resolvedAt: new Date().toISOString(),
            resolvedBy: linkedByUserId,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(armcareExamsUnmatched.id, exam.id));

        examsLinked++;
      }

      return {
        success: true,
        examsLinked,
        mappingCreated: !existingMapping,
      };
    } catch (error) {
      console.error(
        "[ArmCareRepo] linkArmcarePlayer - Database error: ",
        error
      );
      throw new Error("Failed to link ArmCare player to Path player");
    }
  },

  /**
   * Gets all exams for a player.
   * @param playerId
   * @returns An array of exams
   * @throws Error if there is an error with the database query
   */
  getPlayerExams: async (playerId: string) => {
    try {
      const exams = await db.query.armcareExams.findMany({
        where: eq(armcareExams.playerId, playerId),
        orderBy: desc(armcareExams.examDate),
      });

      return exams;
    } catch (error) {
      console.error("[ArmCareRepo] getPlayerExams - Database error: ", error);
      throw new Error("Failed to fetch player exams from the database");
    }
  },

  /**
   * Gets a single exam by ID.
   * @param id The ID of the exam
   * @returns The exam
   * @throws Error if there is an error with the database query
   */
  getExamById: async (id: string) => {
    try {
      const exam = await db.query.armcareExams.findFirst({
        where: eq(armcareExams.id, id),
      });

      return exam;
    } catch (error) {
      console.error("[ArmCareRepo] getExamById - Database error: ", error);
      throw new Error("Failed to fetch exam from the database");
    }
  },

  /**
   * Gets the latest exam for a player.
   * @param playerId The ID of the player
   * @returns The latest exam
   * @throws Error if there is an error with the database query
   */
  getLatestPlayerExam: async (playerId: string) => {
    try {
      const exam = await db.query.armcareExams.findFirst({
        where: eq(armcareExams.playerId, playerId),
        orderBy: desc(armcareExams.examDate),
      });

      return exam;
    } catch (error) {
      console.error(
        "[ArmCareRepo] getLatestPlayerExam - Database error: ",
        error
      );
      throw new Error("Failed to fetch latest player exam from the database");
    }
  },

  /**
   * Gets the ArmCare summary for a player with all normalized metrics from their exam history.
   * Returns arrays of values suitable for charting and trend analysis.
   * @param playerId The ID of the player
   * @returns The summary with latest exam, historical data arrays, and statistics
   * @throws Error if there is an error with the database query
   */
  getPlayerSummary: async (playerId: string) => {
    try {
      // Get all exams for the player, ordered by date (oldest first for chart display)
      const exams = await db.query.armcareExams.findMany({
        where: eq(armcareExams.playerId, playerId),
        orderBy: asc(armcareExams.examDate),
      });

      if (exams.length === 0) {
        return {
          latestExam: null,
          history: {
            armScore: [],
            totalStrength: [],
            shoulderBalance: [],
            velo: [],
            svr: [],
            totalStrengthPost: [],
            postStrengthLoss: [],
            totalPercentFresh: [],
          },
          stats: {
            totalExams: 0,
            avgArmScore: null,
            avgTotalStrength: null,
            avgShoulderBalance: null,
            firstExamDate: null,
            lastExamDate: null,
          },
        };
      }

      // Get latest exam (last in the ordered array)
      const latestExam = exams[exams.length - 1];

      // Build history arrays for charting
      const history = {
        armScore: exams.map((exam) => ({
          date: exam.examDate,
          value: exam.armScore ? parseFloat(exam.armScore) : null,
          examType: exam.examType,
          examId: exam.id,
        })),
        totalStrength: exams.map((exam) => ({
          date: exam.examDate,
          value: exam.totalStrength ? parseFloat(exam.totalStrength) : null,
          examType: exam.examType,
          examId: exam.id,
        })),
        shoulderBalance: exams.map((exam) => ({
          date: exam.examDate,
          value: exam.shoulderBalance ? parseFloat(exam.shoulderBalance) : null,
          examType: exam.examType,
          examId: exam.id,
        })),
        velo: exams.map((exam) => ({
          date: exam.examDate,
          value: exam.velo ? parseFloat(exam.velo) : null,
          examType: exam.examType,
          examId: exam.id,
        })),
        svr: exams.map((exam) => ({
          date: exam.examDate,
          value: exam.svr ? parseFloat(exam.svr) : null,
          examType: exam.examType,
          examId: exam.id,
        })),
        totalStrengthPost: exams.map((exam) => ({
          date: exam.examDate,
          value: exam.totalStrengthPost
            ? parseFloat(exam.totalStrengthPost)
            : null,
          examType: exam.examType,
          examId: exam.id,
        })),
        postStrengthLoss: exams.map((exam) => ({
          date: exam.examDate,
          value: exam.postStrengthLoss
            ? parseFloat(exam.postStrengthLoss)
            : null,
          examType: exam.examType,
          examId: exam.id,
        })),
        totalPercentFresh: exams.map((exam) => ({
          date: exam.examDate,
          value: exam.totalPercentFresh
            ? parseFloat(exam.totalPercentFresh)
            : null,
          examType: exam.examType,
          examId: exam.id,
        })),
      };

      // Calculate statistics (filtering out null values)
      const armScores = history.armScore
        .map((d) => d.value)
        .filter((v): v is number => v !== null);
      const totalStrengths = history.totalStrength
        .map((d) => d.value)
        .filter((v): v is number => v !== null);
      const shoulderBalances = history.shoulderBalance
        .map((d) => d.value)
        .filter((v): v is number => v !== null);

      const stats = {
        totalExams: exams.length,
        avgArmScore:
          armScores.length > 0
            ? armScores.reduce((sum, val) => sum + val, 0) / armScores.length
            : null,
        avgTotalStrength:
          totalStrengths.length > 0
            ? totalStrengths.reduce((sum, val) => sum + val, 0) /
              totalStrengths.length
            : null,
        avgShoulderBalance:
          shoulderBalances.length > 0
            ? shoulderBalances.reduce((sum, val) => sum + val, 0) /
              shoulderBalances.length
            : null,
        firstExamDate: exams[0].examDate,
        lastExamDate: latestExam.examDate,
      };

      return {
        latestExam,
        history,
        stats,
      };
    } catch (error) {
      console.error("[ArmCareRepo] getPlayerSummary - Database error: ", error);
      throw new Error("Failed to fetch player summary from the database");
    }
  },
  getLatestPlayerArmScore: async (playerId: string) => {
    try {
      const exam = await db.query.armcareExams.findFirst({
        where: and(
          eq(armcareExams.playerId, playerId),
          isNotNull(armcareExams.armScore)
        ),
        orderBy: desc(armcareExams.examDate),
        columns: {
          armScore: true,
          examDate: true,
        },
      });

      return exam;
    } catch (error) {
      console.error(
        "[ArmCareRepo] getLatestPlayerExam - Database error: ",
        error
      );
      throw new Error("Failed to fetch latest player exam from the database");
    }
  },
};
