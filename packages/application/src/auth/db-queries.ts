import { and, eq } from "drizzle-orm";

import type { AuthContextQueries } from "@ams/auth/auth-context";
import type { ClientAuthQueries } from "@ams/auth/client-auth";
import type { AuthSessionQueries } from "@ams/auth/next-auth";
import db from "@ams/db";
import {
  attachments,
  drills,
  injury,
  lesson,
  playerInformation,
  universalRoutines,
  userRoles,
  users,
} from "@ams/db/schema";

async function findUserBySessionLookup({
  userId,
  email,
}: {
  userId: string | null;
  email: string | null;
}) {
  if (userId) {
    const [dbUser] = await db
      .select({
        id: users.id,
        email: users.email,
        systemRole: users.systemRole,
        role: users.role,
        access: users.access,
        isActive: users.isActive,
        facilityId: users.facilityId,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return dbUser ?? null;
  }

  if (!email) {
    return null;
  }

  const [dbUser] = await db
    .select({
      id: users.id,
      email: users.email,
      systemRole: users.systemRole,
      role: users.role,
      access: users.access,
      isActive: users.isActive,
      facilityId: users.facilityId,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return dbUser ?? null;
}

export function createAuthSessionQueries(): AuthSessionQueries {
  return {
    async findActorIdentity(userId) {
      const [identity] = await db
        .select({
          id: users.id,
          email: users.email,
          systemRole: users.systemRole,
          role: users.role,
          access: users.access,
          isActive: users.isActive,
          facilityId: users.facilityId,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      return identity ?? null;
    },
    async listMemberships(userId) {
      return db
        .select({
          facilityId: userRoles.facilityId,
          role: userRoles.role,
          access: userRoles.access,
          isActive: userRoles.isActive,
        })
        .from(userRoles)
        .where(eq(userRoles.userId, userId));
    },
    async findPlayerIdByUserId(userId) {
      const [player] = await db
        .select({ id: playerInformation.id })
        .from(playerInformation)
        .where(eq(playerInformation.userId, userId))
        .limit(1);

      return player?.id ?? null;
    },
  };
}

export function createAuthContextQueries(): AuthContextQueries {
  return {
    async findUserForSession(lookup) {
      return findUserBySessionLookup(lookup);
    },
    async listMembershipsForUser(userId) {
      return db
        .select({
          facilityId: userRoles.facilityId,
          role: userRoles.role,
          access: userRoles.access,
          isActive: userRoles.isActive,
        })
        .from(userRoles)
        .where(eq(userRoles.userId, userId));
    },
    async findPlayerByUserId(userId) {
      const [player] = await db
        .select({ id: playerInformation.id })
        .from(playerInformation)
        .where(eq(playerInformation.userId, userId))
        .limit(1);

      return player ?? null;
    },
    async findPlayerAccessRecord(playerId) {
      const [player] = await db
        .select({
          playerId: playerInformation.id,
          facilityId: playerInformation.facilityId,
        })
        .from(playerInformation)
        .where(eq(playerInformation.id, playerId))
        .limit(1);

      return player ?? null;
    },
    async findLessonAccessRecord(lessonId) {
      const [record] = await db
        .select({
          playerId: lesson.playerId,
          facilityId: playerInformation.facilityId,
        })
        .from(lesson)
        .innerJoin(playerInformation, eq(lesson.playerId, playerInformation.id))
        .where(eq(lesson.id, lessonId))
        .limit(1);

      return record ?? null;
    },
    async findAttachmentAccessRecord(attachmentId) {
      const [record] = await db
        .select({
          playerId: attachments.athleteId,
          facilityId: attachments.facilityId,
          playerFacilityId: playerInformation.facilityId,
        })
        .from(attachments)
        .leftJoin(playerInformation, eq(attachments.athleteId, playerInformation.id))
        .where(eq(attachments.id, attachmentId))
        .limit(1);

      if (!record) {
        return null;
      }

      return {
        playerId: record.playerId,
        facilityId: record.facilityId ?? record.playerFacilityId ?? null,
      };
    },
    async findInjuryAccessRecord(injuryId) {
      const [record] = await db
        .select({
          playerId: injury.playerId,
          facilityId: playerInformation.facilityId,
        })
        .from(injury)
        .innerJoin(playerInformation, eq(injury.playerId, playerInformation.id))
        .where(eq(injury.id, injuryId))
        .limit(1);

      return record ?? null;
    },
    async findDrillAccessRecord(drillId) {
      const [record] = await db
        .select({
          createdBy: drills.createdBy,
          facilityId: users.facilityId,
        })
        .from(drills)
        .innerJoin(users, eq(drills.createdBy, users.id))
        .where(eq(drills.id, drillId))
        .limit(1);

      return record ?? null;
    },
    async findUniversalRoutineAccessRecord(routineId) {
      const [record] = await db
        .select({
          createdBy: universalRoutines.createdBy,
          facilityId: universalRoutines.facilityId,
        })
        .from(universalRoutines)
        .where(eq(universalRoutines.id, routineId))
        .limit(1);

      return record ?? null;
    },
    async listPlayerIdsForFacility(facilityId) {
      const players = await db
        .select({ id: playerInformation.id })
        .from(playerInformation)
        .where(eq(playerInformation.facilityId, facilityId));

      return players.map((player) => player.id);
    },
    async findPlayerInFacilityByUserId(userId, facilityId) {
      const [player] = await db
        .select({ id: playerInformation.id })
        .from(playerInformation)
        .where(
          and(
            eq(playerInformation.userId, userId),
            eq(playerInformation.facilityId, facilityId)
          )
        )
        .limit(1);

      return player ?? null;
    },
  };
}

export function createClientAuthQueries(): ClientAuthQueries {
  return {
    async findUserForSession(lookup) {
      return findUserBySessionLookup(lookup);
    },
    async listMembershipsForUser(userId) {
      return db
        .select({
          facilityId: userRoles.facilityId,
          role: userRoles.role,
          access: userRoles.access,
          isActive: userRoles.isActive,
        })
        .from(userRoles)
        .where(and(eq(userRoles.userId, userId), eq(userRoles.role, "client")));
    },
  };
}
