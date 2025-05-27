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
  console.log("Searching for user ID:", id);
  console.log("ID length:", id.length);
  console.log(
    "ID format check:",
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  );
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
