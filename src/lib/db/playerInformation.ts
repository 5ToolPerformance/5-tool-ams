import { eq } from "drizzle-orm";

import db from "@/db";
import { playerInformation } from "@/db/schema";

export const getPlayerInformationByUserId = async (userId: string) => {
  const result = await db
    .select()
    .from(playerInformation)
    .where(eq(playerInformation.userId, userId));
  return result[0]; // Assuming one-to-one relationship
};
