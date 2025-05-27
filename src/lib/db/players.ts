import { eq } from "drizzle-orm";

import db from "@/db";
import { playerInformation, users } from "@/db/schema";

export const getAllPlayers = async () => {
  return await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      email: users.email,
      image: users.image,
      height: playerInformation.height,
      weight: playerInformation.weight,
      position: playerInformation.position,
      hits: playerInformation.hits,
      throws: playerInformation.throws,
      date_of_birth: playerInformation.date_of_birth,
    })
    .from(users)
    .innerJoin(playerInformation, eq(users.id, playerInformation.userId));
};

export const getPlayerById = async (id: string) => {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      email: users.email,
      image: users.image,
      height: playerInformation.height,
      weight: playerInformation.weight,
      position: playerInformation.position,
      hits: playerInformation.hits,
      throws: playerInformation.throws,
      date_of_birth: playerInformation.date_of_birth,
    })
    .from(users)
    .leftJoin(playerInformation, eq(users.id, playerInformation.userId))
    .where(eq(users.id, id))
    .limit(1);

  return result[0] || null;
};
