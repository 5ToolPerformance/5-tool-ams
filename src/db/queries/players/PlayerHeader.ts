import { and, eq, gte, lte } from "drizzle-orm";

import db from "@/db";
import {
  athleteContextFlags,
  externalAthleteIds,
  playerInformation,
  playerPositions,
  positions,
} from "@/db/schema";
import { calculateAge } from "@/lib/dates";
import { toHandednessAbbrev } from "@/lib/utils/handedness";

export async function getPlayerCore(playerId: string) {
  const [player] = await db
    .select({
      id: playerInformation.id,
      firstName: playerInformation.firstName,
      lastName: playerInformation.lastName,
      dob: playerInformation.date_of_birth,
      batHand: playerInformation.hits,
      throwHand: playerInformation.throws,
      height: playerInformation.height,
      weight: playerInformation.weight,
    })
    .from(playerInformation)
    .where(eq(playerInformation.id, playerId));
  return player;
}

export async function getPlayerPositions(playerId: string) {
  const rows = await db
    .select({
      name: positions.name,
    })
    .from(playerPositions)
    .innerJoin(positions, eq(playerPositions.positionId, positions.id))
    .where(eq(playerPositions.playerId, playerId));

  return rows.map((r) => r.name);
}

export async function getPlayerStatus(playerId: string) {
  const today = new Date().toISOString().slice(0, 10);

  const activeFlags = await db
    .select({
      type: athleteContextFlags.contextType,
      notes: athleteContextFlags.notes,
    })
    .from(athleteContextFlags)
    .where(
      and(
        eq(athleteContextFlags.athleteId, playerId),
        lte(athleteContextFlags.startDate, today),
        gte(athleteContextFlags.endDate, today)
      )
    );

  const injuryFlag = activeFlags.some((f) => f.type === "injury");

  return {
    availability: injuryFlag ? "injured" : "active",
    restrictions: activeFlags.map((f) => f.notes).filter(Boolean),
    injuryFlag,
  };
}

export async function getPlayerSystems(playerId: string) {
  const systems = await db
    .select({
      system: externalAthleteIds.externalSystem,
      externalId: externalAthleteIds.externalId,
    })
    .from(externalAthleteIds)
    .where(eq(externalAthleteIds.playerId, playerId));

  return systems.map((s) => ({
    system: s.system,
    connected: true,
  }));
}

export async function getPlayerHeader(playerId: string) {
  const [core, positions, status, systems] = await Promise.all([
    getPlayerCore(playerId),
    getPlayerPositions(playerId),
    getPlayerStatus(playerId),
    getPlayerSystems(playerId),
  ]);

  return {
    id: core.id,
    name: `${core.firstName} ${core.lastName}`,
    dob: core.dob,
    age: calculateAge(core.dob),
    handedness: {
      bat: toHandednessAbbrev(core.batHand),
      throw: toHandednessAbbrev(core.throwHand),
    },
    positions,
    height: core.height,
    weight: core.weight,
    status,
    systems,
  };
}
