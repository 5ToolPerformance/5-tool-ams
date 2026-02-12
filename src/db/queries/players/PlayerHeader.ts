import { and, eq, gte, lte, ne } from "drizzle-orm";

import db from "@/db";
import {
  athleteContextFlags,
  externalAthleteIds,
  injury,
  playerInformation,
  playerPositions,
  positions,
  users,
} from "@/db/schema";
import { Handedness } from "@/domain/player/header/types";
import { calculateAge } from "@/lib/dates";

function assertHandedness(value: string): Handedness {
  if (value === "right" || value === "left" || value === "switch") {
    return value;
  }
  throw new Error(`Invalid handedness value: ${value}`);
}

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
      sport: playerInformation.sport,
      primaryCoachId: playerInformation.primaryCoachId,
      primaryCoachName: users.name,
      prospect: playerInformation.prospect,
    })
    .from(playerInformation)
    .leftJoin(users, eq(playerInformation.primaryCoachId, users.id))
    .where(eq(playerInformation.id, playerId));
  return player;
}

export async function getPlayerPositions(playerId: string) {
  return db
    .select({
      id: positions.id,
      code: positions.code,
      name: positions.name,
      isPrimary: playerPositions.isPrimary,
    })
    .from(playerPositions)
    .innerJoin(positions, eq(playerPositions.positionId, positions.id))
    .where(eq(playerPositions.playerId, playerId));
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
  const activeInjuries = await db
    .select({
      level: injury.level,
    })
    .from(injury)
    .where(and(eq(injury.playerId, playerId), ne(injury.status, "resolved")));

  const levelRank = {
    soreness: 1,
    injury: 2,
    diagnosis: 3,
  } as const;

  const activeInjuryLevel =
    activeInjuries.length > 0
      ? [...activeInjuries]
          .sort((a, b) => levelRank[b.level] - levelRank[a.level])[0]
          .level
      : null;

  return {
    availability: injuryFlag ? "injured" : "active",
    restrictions: activeFlags.map((f) => f.notes).filter(Boolean),
    injuryFlag,
    activeInjuryLevel,
  } as const;
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
    firstName: core.firstName,
    lastName: core.lastName,
    dob: core.dob,
    age: calculateAge(core.dob),
    handedness: {
      bat: assertHandedness(core.batHand),
      throw: assertHandedness(core.throwHand),
    },
    positions,
    sport: core.sport,
    height: core.height,
    weight: core.weight,
    status,
    systems,
    primaryCoachId: core.primaryCoachId,
    primaryCoachName: core.primaryCoachName,
    prospect: core.prospect,
  };
}
