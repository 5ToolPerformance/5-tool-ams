import { and, eq } from "drizzle-orm";

import db from "@/db";
import {
  motorPreferences,
  playerInformation,
  playerMeasurements,
} from "@/db/schema";
import { MotorPreferencesForm } from "@/types/assessments";
import { PlayerInsert } from "@/types/database";

export class PlayerService {
  /**
   * Retrieve the Player's information given a playerId
   * @param playerId - The ID of the player to get information for
   * @returns playerInformation for the given playerId if it exists
   */
  static async getPlayerInformationById(playerId: string) {
    try {
      const playerData = await db
        .select()
        .from(playerInformation)
        .where(eq(playerInformation.id, playerId))
        .limit(1);

      if (playerData.length === 0) {
        return null;
      }

      return playerData[0];
    } catch (error) {
      console.error("Error fetching player information:", error);
      throw new Error("Failed to fetch player information");
    }
  }

  /**
   * Create playerInformation in database for a player based on ID
   * @param data - The information for to be posted for the player
   * @returns The completed playerInformation to be posted in the Db
   */
  static async createPlayerInformation(data: PlayerInsert) {
    return await db.transaction(async (tx) => {
      try {
        const [newPlayerInfo] = await tx
          .insert(playerInformation)
          .values({
            userId: data.userId,
            firstName: data.firstName,
            lastName: data.lastName,
            height: data.height,
            weight: data.weight,
            position: data.position,
            throws: data.throws,
            hits: data.hits,
            prospect: data.prospect,
            date_of_birth: data.date_of_birth,
            sport: data.sport,
            primaryCoachId: data.primaryCoachId,
          })
          .returning();

        await tx.insert(playerMeasurements).values({
          playerId: newPlayerInfo.id,
          height: newPlayerInfo.height,
          weight: newPlayerInfo.weight,
        });

        return newPlayerInfo;
      } catch (error) {
        tx.rollback();
        console.error("Error creating player information:", error);
        throw new Error("Failed to create player information");
      }
    });
  }

  /**
   * Update an existing player's information
   * @param playerId - The ID of the playerInformation row to update
   * @param data - Partial set of fields to update
   * @returns The updated playerInformation record
   */
  static async updatePlayerInformation(
    playerId: string,
    data: Partial<PlayerInsert>
  ) {
    return await db.transaction(async (tx) => {
      try {
        const currentRows = await tx
          .select()
          .from(playerInformation)
          .where(eq(playerInformation.id, playerId))
          .limit(1);

        const current = currentRows[0];

        if (!current) {
          // Nothing to update because the player does not exist
          return null;
        }

        // Build an update payload without undefined values or immutable keys
        const updatePayload: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(
          data as Record<string, unknown>
        )) {
          if (key === "id") continue; // never allow updating the primary key
          if (value !== undefined) updatePayload[key] = value;
        }

        if (Object.keys(updatePayload).length === 0) {
          // Nothing to update; return the current record
          return current;
        }

        const heightChanged =
          updatePayload.height !== undefined && data.height !== current.height;
        const weightChanged =
          updatePayload.weight !== undefined && data.weight !== current.weight;

        if (heightChanged || weightChanged) {
          await tx.insert(playerMeasurements).values({
            playerId: current.id,
            height: data.height ?? current.height,
            weight: data.weight ?? current.weight,
          });
        }

        const [updated] = await tx
          .update(playerInformation)
          .set(updatePayload as Partial<PlayerInsert>)
          .where(eq(playerInformation.id, playerId))
          .returning();

        return updated ?? null;
      } catch (error) {
        console.error("Error updating player information:", error);
        throw new Error("Failed to update player information");
      }
    });
  }

  /**
   * Create a motor preference exam in the database
   * @param data - The form data for the Motor Preference Assessment
   * @returns the completed Motor Preference assessment type
   */
  static async createMotorPreferences(data: MotorPreferencesForm) {
    try {
      const [newMotorPreference] = await db
        .insert(motorPreferences)
        .values({
          playerId: data.playerId,
          coachId: data.coachId,
          archetype: data.archetype,
          extensionLeg: data.extensionLeg,
          breath: data.breath,
          association: data.association,
          assessmentDate: new Date(data.assessmentDate),
        })
        .returning();

      return newMotorPreference;
    } catch (error) {
      console.error("Error creating motor preference assessment:", error);
      throw new Error("Failed to create motor preference assessment");
    }
  }

  /**
   * Retrieve the Motor Preference Assessment given a playerId
   * @param playerId - The ID of the player to get the Motor Preference Assessment for
   * @returns motorPreference for the given playerId if it exists
   */
  static async getMotorPreferencesById(playerId: string) {
    try {
      const playerMPE = await db
        .select()
        .from(motorPreferences)
        .where(eq(motorPreferences.playerId, playerId))
        .limit(1);

      if (playerMPE.length === 0) {
        return null;
      }

      return playerMPE;
    } catch (error) {
      console.error(
        "Error fetching motor preference assessment by player id:",
        error
      );
      throw new Error("Failed to fetch motor preference assessment");
    }
  }

  /**
   * Retrieve all players with their information
   * @returns An array of PlayerInformation objects
   */
  static async getAllPlayersWithInformation() {
    try {
      const players = await db.select().from(playerInformation);

      return players;
    } catch (error) {
      console.error("Error fetching players with information:", error);
      throw new Error("Failed to fetch players with information");
    }
  }

  /**
   * Retrieve a player by their ID
   * @param playerId - The ID of the player to retrieve
   * @returns The PlayerInformation object if found, otherwise null
   */
  static async getPlayerById(playerId: string) {
    try {
      const player = await db
        .select()
        .from(playerInformation)
        .where(eq(playerInformation.id, playerId))
        .limit(1);

      if (player.length === 0) {
        return null;
      }

      return player[0];
    } catch (error) {
      console.error("Error fetching player by id:", error);
      throw new Error("Failed to fetch player");
    }
  }

  static async getPlayerByIdScoped(playerId: string, facilityId: string) {
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
      console.error("Error fetching scoped player by id:", error);
      throw new Error("Failed to fetch player");
    }
  }

  static async getAllPlayersWithInformationScoped(facilityId: string) {
    try {
      return await db
        .select()
        .from(playerInformation)
        .where(eq(playerInformation.facilityId, facilityId));
    } catch (error) {
      console.error("Error fetching scoped players with information:", error);
      throw new Error("Failed to fetch players with information");
    }
  }
}
