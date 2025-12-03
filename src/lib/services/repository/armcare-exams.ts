import { and, desc, eq } from "drizzle-orm";

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
};
