import { eq } from "drizzle-orm";

import db from "@/db";
import { playerInformation } from "@/db/schema";

export class PlayerService {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async createPlayerInformation(playerId: string, data: any) {
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
}
