import { eq } from "drizzle-orm";

import db, { DB } from "@/db";
import { playerInformation } from "@/db/schema";

export interface PlayerDirectoryBaseRow {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  throws: string;
  hits: string;
  prospect: boolean;
  sport: "baseball" | "softball";
  primaryCoachId: string | null;
  createdAt: string;
  legacyPosition: string | null;
}

export async function listPlayersDirectoryBase(
  facilityId: string,
  conn: DB = db
) {
  return conn
    .select({
      id: playerInformation.id,
      firstName: playerInformation.firstName,
      lastName: playerInformation.lastName,
      dateOfBirth: playerInformation.date_of_birth,
      throws: playerInformation.throws,
      hits: playerInformation.hits,
      prospect: playerInformation.prospect,
      sport: playerInformation.sport,
      primaryCoachId: playerInformation.primaryCoachId,
      createdAt: playerInformation.created_at,
      legacyPosition: playerInformation.position,
    })
    .from(playerInformation)
    .where(eq(playerInformation.facilityId, facilityId))
    .orderBy(playerInformation.lastName, playerInformation.firstName);
}

