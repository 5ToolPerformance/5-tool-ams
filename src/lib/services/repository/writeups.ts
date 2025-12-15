import { desc, eq } from "drizzle-orm";

import { PlayerWriteupData } from "@/components/forms/PlayerWriteupForm";
import db from "@/db";
import { writeupLog, writeups } from "@/db/schema";
import { WriteupLogInsert, WriteupLogSelect } from "@/types/database";

export interface WriteupLogWithDetails extends WriteupLogSelect {
  player: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  coach: {
    id: string;
    name: string;
  } | null;
}

export const writeupRepository = {
  createWriteup: async (data: PlayerWriteupData) => {
    if (!data.coach_id || !data.player_id || !data.type) {
      throw new Error("Missing required fields");
    }
    const writeupData = {
      coachId: data.coach_id as string,
      playerId: data.player_id as string,
      writeupType: data.type as string,
      content: {
        sections: data.sections,
        goals: data.goals,
      },
      notes: data.notes,
    };
    try {
      const writeup = await db.insert(writeups).values(writeupData).returning();
      return writeup;
    } catch (error) {
      console.error("[WriteupRepo] createWriteup - Database error: ", error);
      throw new Error("Failed to create writeup");
    }
  },

  /**
   * Creates a new writeup log entry
   * @param data - The data to create the writeup log entry with
   * @returns The created writeup log entry
   */
  createWriteupLog: async (data: WriteupLogInsert) => {
    const writeup = await db.insert(writeupLog).values(data).returning();
    return writeup;
  },

  /**
   * Gets the writeup log for a specific player
   * @param playerId - The ID of the player to get the writeup log for
   * @returns The writeup log for the player
   */
  getPlayerWriteupLog: async (playerId: string) => {
    return db
      .select()
      .from(writeupLog)
      .where(eq(writeupLog.playerId, playerId))
      .orderBy(desc(writeupLog.writeupDate));
  },

  // TODO: getAll with filters
  // TODO: getById
  // TODO: update
  // TODO: delete
  // TODO: getPlayerStats
};
