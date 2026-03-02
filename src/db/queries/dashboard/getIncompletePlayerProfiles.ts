import { eq, sql } from "drizzle-orm";

import db, { DB } from "@/db";
import { playerInformation, playerPositions } from "@/db/schema";

export interface IncompleteProfileRawRow {
  playerId: string;
  firstName: string;
  lastName: string;
  primaryCoachId: string | null;
  throws: string;
  hits: string;
  dateOfBirth: string;
  hasPrimaryPosition: boolean;
}

export async function getIncompletePlayerProfiles(
  facilityId: string,
  conn: DB = db
): Promise<IncompleteProfileRawRow[]> {
  return conn
    .select({
      playerId: playerInformation.id,
      firstName: playerInformation.firstName,
      lastName: playerInformation.lastName,
      primaryCoachId: playerInformation.primaryCoachId,
      throws: playerInformation.throws,
      hits: playerInformation.hits,
      dateOfBirth: playerInformation.date_of_birth,
      hasPrimaryPosition: sql<boolean>`
        exists(
          select 1
          from ${playerPositions}
          where ${playerPositions.playerId} = ${playerInformation.id}
            and ${playerPositions.isPrimary} = true
        )
      `,
    })
    .from(playerInformation)
    .where(eq(playerInformation.facilityId, facilityId));
}

