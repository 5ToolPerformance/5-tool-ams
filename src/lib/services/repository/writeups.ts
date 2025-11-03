import { PlayerWriteupData } from "@/components/forms/PlayerWriteupForm";
import db from "@/db";
import { writeups } from "@/db/schema";

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
};
