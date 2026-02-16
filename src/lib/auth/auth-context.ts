import { and, eq } from "drizzle-orm";

import { auth } from "@/auth";
import db from "@/db";
import {
  attachments,
  drills,
  injury,
  lesson,
  playerInformation,
  users,
} from "@/db/schema";

export type AppRole = "player" | "coach" | "admin";

export type AuthContext = {
  userId: string;
  role: AppRole;
  facilityId: string;
  playerId: string | null;
  email: string;
};

export class AuthError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function isAppRole(role: string | null | undefined): role is AppRole {
  return role === "player" || role === "coach" || role === "admin";
}

export async function getAuthContext(): Promise<AuthContext> {
  const session = await auth();
  const sessionUserId = session?.user?.id;
  const sessionEmail = session?.user?.email?.toLowerCase();

  if (!sessionUserId && !sessionEmail) {
    throw new AuthError(401, "Unauthorized");
  }

  const [dbUser] =
    sessionUserId
      ? await db
          .select({
            id: users.id,
            email: users.email,
            role: users.role,
            facilityId: users.facilityId,
          })
          .from(users)
          .where(eq(users.id, sessionUserId))
          .limit(1)
      : await db
          .select({
            id: users.id,
            email: users.email,
            role: users.role,
            facilityId: users.facilityId,
          })
          .from(users)
          .where(eq(users.email, sessionEmail!))
          .limit(1);

  if (!dbUser) {
    throw new AuthError(401, "Unauthorized");
  }

  if (!isAppRole(dbUser.role)) {
    throw new AuthError(403, "User role is not authorized");
  }

  if (!dbUser.facilityId) {
    throw new AuthError(403, "User is not assigned to a facility");
  }

  const [player] = await db
    .select({
      id: playerInformation.id,
    })
    .from(playerInformation)
    .where(eq(playerInformation.userId, dbUser.id))
    .limit(1);

  return {
    userId: dbUser.id,
    role: dbUser.role,
    facilityId: dbUser.facilityId,
    playerId: player?.id ?? null,
    email: dbUser.email,
  };
}

export function requireRole(ctx: AuthContext, roles: AppRole[]) {
  if (!roles.includes(ctx.role)) {
    throw new AuthError(403, "Forbidden");
  }
}

export function assertFacilityAccess(
  ctx: AuthContext,
  resourceFacilityId: string | null
) {
  if (!resourceFacilityId || resourceFacilityId !== ctx.facilityId) {
    throw new AuthError(404, "Resource not found");
  }
}

export async function assertPlayerAccess(ctx: AuthContext, playerId: string) {
  if (ctx.role === "player") {
    if (ctx.playerId !== playerId) {
      throw new AuthError(403, "Forbidden");
    }
    return;
  }

  const [player] = await db
    .select({
      id: playerInformation.id,
      facilityId: playerInformation.facilityId,
    })
    .from(playerInformation)
    .where(eq(playerInformation.id, playerId))
    .limit(1);

  if (!player) {
    throw new AuthError(404, "Resource not found");
  }

  assertFacilityAccess(ctx, player.facilityId);
}

export async function assertCanAccessLesson(ctx: AuthContext, lessonId: string) {
  const [record] = await db
    .select({
      lessonId: lesson.id,
      playerId: lesson.playerId,
      facilityId: playerInformation.facilityId,
    })
    .from(lesson)
    .innerJoin(playerInformation, eq(lesson.playerId, playerInformation.id))
    .where(eq(lesson.id, lessonId))
    .limit(1);

  if (!record) {
    throw new AuthError(404, "Resource not found");
  }

  if (ctx.role === "player" && ctx.playerId !== record.playerId) {
    throw new AuthError(403, "Forbidden");
  }

  if (ctx.role !== "player") {
    assertFacilityAccess(ctx, record.facilityId);
  }
}

export async function assertCanAccessAttachment(
  ctx: AuthContext,
  attachmentId: string
) {
  const [record] = await db
    .select({
      attachmentId: attachments.id,
      playerId: attachments.athleteId,
      attachmentFacilityId: attachments.facilityId,
      playerFacilityId: playerInformation.facilityId,
    })
    .from(attachments)
    .leftJoin(playerInformation, eq(attachments.athleteId, playerInformation.id))
    .where(eq(attachments.id, attachmentId))
    .limit(1);

  if (!record) {
    throw new AuthError(404, "Resource not found");
  }

  if (ctx.role === "player") {
    if (!record.playerId || ctx.playerId !== record.playerId) {
      throw new AuthError(403, "Forbidden");
    }
    return;
  }

  assertFacilityAccess(
    ctx,
    record.attachmentFacilityId ?? record.playerFacilityId ?? null
  );
}

export async function assertCanAccessInjury(ctx: AuthContext, injuryId: string) {
  const [record] = await db
    .select({
      injuryId: injury.id,
      playerId: injury.playerId,
      facilityId: playerInformation.facilityId,
    })
    .from(injury)
    .innerJoin(playerInformation, eq(injury.playerId, playerInformation.id))
    .where(eq(injury.id, injuryId))
    .limit(1);

  if (!record) {
    throw new AuthError(404, "Resource not found");
  }

  if (ctx.role === "player" && ctx.playerId !== record.playerId) {
    throw new AuthError(403, "Forbidden");
  }

  if (ctx.role !== "player") {
    assertFacilityAccess(ctx, record.facilityId);
  }
}

export async function assertCanReadDrill(ctx: AuthContext, drillId: string) {
  const [record] = await db
    .select({
      drillId: drills.id,
      createdBy: drills.createdBy,
      creatorFacilityId: users.facilityId,
    })
    .from(drills)
    .innerJoin(users, eq(drills.createdBy, users.id))
    .where(eq(drills.id, drillId))
    .limit(1);

  if (!record) {
    throw new AuthError(404, "Resource not found");
  }

  if (ctx.role === "player") {
    throw new AuthError(403, "Forbidden");
  }

  assertFacilityAccess(ctx, record.creatorFacilityId);
}

export async function assertCanEditDrill(ctx: AuthContext, drillId: string) {
  const [record] = await db
    .select({
      drillId: drills.id,
      createdBy: drills.createdBy,
      creatorFacilityId: users.facilityId,
    })
    .from(drills)
    .innerJoin(users, eq(drills.createdBy, users.id))
    .where(eq(drills.id, drillId))
    .limit(1);

  if (!record) {
    throw new AuthError(404, "Resource not found");
  }

  if (ctx.role === "player") {
    throw new AuthError(403, "Forbidden");
  }

  assertFacilityAccess(ctx, record.creatorFacilityId);

  if (ctx.role === "coach" && record.createdBy !== ctx.userId) {
    throw new AuthError(403, "Forbidden");
  }
}

export async function getScopedPlayerIdsForFacility(facilityId: string) {
  const players = await db
    .select({ id: playerInformation.id })
    .from(playerInformation)
    .where(eq(playerInformation.facilityId, facilityId));

  return players.map((p) => p.id);
}

export async function getPlayerInFacilityByUserId(userId: string, facilityId: string) {
  const [player] = await db
    .select({
      id: playerInformation.id,
    })
    .from(playerInformation)
    .where(
      and(
        eq(playerInformation.userId, userId),
        eq(playerInformation.facilityId, facilityId)
      )
    )
    .limit(1);

  return player ?? null;
}
