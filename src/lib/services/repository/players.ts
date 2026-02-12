import { and, eq } from "drizzle-orm";

import db from "@/db";
import { playerInformation, playerInjuries } from "@/db/schema";
import { PlayerInjuryInsert } from "@/types/database";

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
      const players = await db
        .select()
        .from(playerInformation)
        .orderBy(playerInformation.lastName);

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
  findByIdScoped: async (playerId: string, facilityId: string) => {
    try {
      const [player] = await db
        .select()
        .from(playerInformation)
        .where(
          and(
            eq(playerInformation.id, playerId),
            eq(playerInformation.facilityId, facilityId)
          )
        )
        .limit(1);

      return player ?? null;
    } catch (error) {
      console.error("[PlayerRepo] findByIdScoped - Database error: ", error);
      throw new Error(`Failed to fetch player ${playerId}`);
    }
  },
  /**
   * Retrieve a player injury by their ID
   * @param playerId - The ID of the player to retrieve
   * @returns The PlayerInjury object if found, otherwise null
   */
  findPlayerInjuryByPlayerId: async (playerId: string) => {
    try {
      const injury = await db
        .select()
        .from(playerInjuries)
        .where(eq(playerInjuries.playerId, playerId));

      return injury;
    } catch (error) {
      console.error(
        "[PlayerRepo] findPlayerInjuryByPlayerId - Database error: ",
        error
      );
      throw new Error(`Failed to fetch injury for player ${playerId}`);
    }
  },
  /**
   * Create a new player injury
   * @param data - The PlayerInjuryInsert object to create
   * @returns The created PlayerInjury object
   */
  createPlayerInjury: async (data: PlayerInjuryInsert) => {
    if (!data.playerId) {
      throw new Error("Player ID required");
    }
    try {
      const [injury] = await db.insert(playerInjuries).values(data).returning();
      return injury;
    } catch (error) {
      console.error(
        "[PlayerRepo] createPlayerInjury - Database error: ",
        error
      );
      throw new Error(`Failed to create injury for player ${data.playerId}`);
    }
  },
  /**
   * Update a player injury
   * @param data - The PlayerInjuryInsert object to update
   * @returns The updated PlayerInjury object
   */
  updatePlayerInjury: async (id: string, data: Partial<PlayerInjuryInsert>) => {
    if (!id) {
      throw new Error("Injury ID required");
    }
    try {
      const [injury] = await db
        .update(playerInjuries)
        .set(data)
        .where(eq(playerInjuries.id, id))
        .returning();

      if (!injury) {
        throw new Error(`Injury with ID ${id} not found`);
      }

      return injury;
    } catch (error) {
      console.error(
        "[PlayerRepo] updatePlayerInjury - Database error: ",
        error
      );
      throw new Error(`Failed to update injury ${id}`);
    }
  },
  /**
   * Find players for lesson form selection
   * @returns Array of players with id, firstName, and lastName
   */
  findPlayersForLessonForm: async () => {
    try {
      const players = await db
        .select({
          id: playerInformation.id,
          firstName: playerInformation.firstName,
          lastName: playerInformation.lastName,
        })
        .from(playerInformation)
        .orderBy(playerInformation.lastName, playerInformation.firstName);

      return players;
    } catch (error) {
      console.error(
        "[PlayerRepo] findPlayersForLessonForm - Database error: ",
        error
      );
      throw new Error("Failed to fetch players for lesson form");
    }
  },
  findPlayersForLessonFormScoped: async (facilityId: string) => {
    try {
      const players = await db
        .select({
          id: playerInformation.id,
          firstName: playerInformation.firstName,
          lastName: playerInformation.lastName,
        })
        .from(playerInformation)
        .where(eq(playerInformation.facilityId, facilityId))
        .orderBy(playerInformation.lastName, playerInformation.firstName);

      return players;
    } catch (error) {
      console.error(
        "[PlayerRepo] findPlayersForLessonFormScoped - Database error: ",
        error
      );
      throw new Error("Failed to fetch players for lesson form");
    }
  },
};
