import { eq } from "drizzle-orm";

import db from "@/db";
import { motorPreferences, playerInformation } from "@/db/schema";
import { MotorPreferencesForm } from "@/types/assessments";
import { PlayerInformation } from "@/types/users";

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
        .where(eq(playerInformation.userId, playerId))
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
   * @param playerId - The ID of the player for the information to be assigned to
   * @param data - The information for to be posted for the player
   * @returns The completed playerInformation to be posted in the Db
   */
  static async createPlayerInformation(
    playerId: string,
    data: PlayerInformation
  ) {
    try {
      const [newPlayerInfo] = await db
        .insert(playerInformation)
        .values({
          userId: playerId,
          height: data.height,
          weight: data.weight,
          position: data.position,
          throws: data.throws,
          hits: data.hits,
          date_of_birth: data.date_of_birth,
        })
        .returning();

      return newPlayerInfo;
    } catch (error) {
      console.error("Error creating player information:", error);
      throw new Error("Failed to create player information");
    }
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
}
