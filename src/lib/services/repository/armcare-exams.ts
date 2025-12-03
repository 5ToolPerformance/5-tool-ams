import { desc, eq } from "drizzle-orm";

import db from "@/db";
import { armcareExamsUnmatched } from "@/db/schema";

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
};
