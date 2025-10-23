import { eq } from "drizzle-orm";

import db from "@/db";
import { playerInformation } from "@/db/schema";

/**
 * PlayerRepository is a service that provides access to player data
 * through the Database.
 */
export const playerRepository = {
  /**
   * Retrieve all players with their information
   * @returns An array of PlayerInformation objects
   */
  findAll: async () => {
    try {
      const players = await db.select().from(playerInformation);

      return players;
    } catch (error) {
      console.error("[PlayerRepo] findAll - Database error: ", error);
      throw new Error("Failed to fetch players from the database");
    }
  },

  /**
   * Retrieve a player by their ID
   * @param playerId - The ID of the player to retrieve
   * @returns The PlayerInformation object if found, otherwise null
   */
  findById: async (playerId: string) => {
    try {
      const player = await db
        .select()
        .from(playerInformation)
        .where(eq(playerInformation.id, playerId));

      return player;
    } catch (error) {
      console.error("[PlayerRepo] findById - Database error: ", error);
      throw new Error(`Failed to fetch player ${playerId}`);
    }
  },
};
