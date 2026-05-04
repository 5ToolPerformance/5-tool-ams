import {
  assertCanEditCoachOwnedResource,
  assertCanReadCoachResource,
  assertFacilityAccess,
  assertPlayerAttachmentAccess,
  assertPlayerResourceAccess,
  PermissionError,
  requireRole,
} from "@ams/permissions";

import {
  buildActor,
  findPrimaryAppMembership,
  type ActorMembershipRecord,
  type ActorIdentityRecord,
  type AppRole,
  type SystemRole,
} from "./actor";
import type { SessionGetter } from "./session";

export type { AppRole } from "./actor";
export { assertFacilityAccess, requireRole } from "@ams/permissions";

export type AuthContext = {
  userId: string;
  issuer: "ams" | "portal" | null;
  role: AppRole;
  facilityId: string;
  playerId: string | null;
  email: string;
  access: "read/write" | "read-only" | "write-only";
  systemRole: SystemRole;
};

export type SessionLookup = {
  userId: string | null;
  email: string | null;
  issuer: "ams" | "portal" | null;
};

export type PlayerAccessRecord = {
  playerId: string;
  facilityId: string | null;
};

export type AttachmentAccessRecord = {
  playerId: string | null;
  facilityId: string | null;
};

export type CoachOwnedResourceRecord = {
  createdBy: string;
  facilityId: string | null;
};

export type AuthContextQueries = {
  findUserForSession(lookup: SessionLookup): Promise<ActorIdentityRecord | null>;
  listMembershipsForUser(userId: string): Promise<ActorMembershipRecord[]>;
  findPlayerByUserId(userId: string): Promise<{ id: string } | null>;
  findPlayerAccessRecord(playerId: string): Promise<PlayerAccessRecord | null>;
  findLessonAccessRecord(lessonId: string): Promise<PlayerAccessRecord | null>;
  findAttachmentAccessRecord(
    attachmentId: string
  ): Promise<AttachmentAccessRecord | null>;
  findInjuryAccessRecord(injuryId: string): Promise<PlayerAccessRecord | null>;
  findDrillAccessRecord(drillId: string): Promise<CoachOwnedResourceRecord | null>;
  findUniversalRoutineAccessRecord(
    routineId: string
  ): Promise<CoachOwnedResourceRecord | null>;
  listPlayerIdsForFacility(facilityId: string): Promise<string[]>;
  findPlayerInFacilityByUserId(
    userId: string,
    facilityId: string
  ): Promise<{ id: string } | null>;
};

export type AuthContextDependencies = {
  getSession: SessionGetter;
  queries: AuthContextQueries;
};

export class AuthError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function toSessionLookup(session: Awaited<ReturnType<SessionGetter>>): SessionLookup {
  return {
    userId: session?.user?.id ?? null,
    email: session?.user?.email?.toLowerCase() ?? null,
    issuer: session?.user?.issuer ?? null,
  };
}

function rethrowPermissionError(error: unknown): never {
  if (error instanceof PermissionError) {
    throw new AuthError(error.status, error.message);
  }

  throw error;
}

export function createAuthContextApi({
  getSession,
  queries,
}: AuthContextDependencies) {
  async function getAuthContext(): Promise<AuthContext> {
    const lookup = toSessionLookup(await getSession());

    if (!lookup.userId && !lookup.email) {
      throw new AuthError(401, "Unauthorized");
    }

    const dbUser = await queries.findUserForSession(lookup);

    if (!dbUser) {
      throw new AuthError(401, "Unauthorized");
    }

    const memberships = await queries.listMembershipsForUser(dbUser.id);
    const actor = buildActor(dbUser, memberships);
    const membership = findPrimaryAppMembership(actor);

    if (!membership) {
      throw new AuthError(403, "User role is not authorized");
    }

    if (!membership.facilityId) {
      throw new AuthError(403, "User is not assigned to a facility");
    }

    const player = await queries.findPlayerByUserId(dbUser.id);

    return {
      userId: dbUser.id,
      issuer: lookup.issuer,
      role: membership.role,
      facilityId: membership.facilityId,
      playerId: player?.id ?? null,
      email: dbUser.email ?? "",
      access: membership.access,
      systemRole: actor.systemRole,
    };
  }

  async function assertPlayerAccess(ctx: AuthContext, playerId: string) {
    const player = await queries.findPlayerAccessRecord(playerId);

    if (!player) {
      throw new AuthError(404, "Resource not found");
    }

    try {
      assertPlayerResourceAccess(ctx, player);
    } catch (error) {
      rethrowPermissionError(error);
    }
  }

  async function assertCanAccessLesson(ctx: AuthContext, lessonId: string) {
    const record = await queries.findLessonAccessRecord(lessonId);

    if (!record) {
      throw new AuthError(404, "Resource not found");
    }

    try {
      assertPlayerResourceAccess(ctx, record);
    } catch (error) {
      rethrowPermissionError(error);
    }
  }

  async function assertCanAccessAttachment(
    ctx: AuthContext,
    attachmentId: string
  ) {
    const record = await queries.findAttachmentAccessRecord(attachmentId);

    if (!record) {
      throw new AuthError(404, "Resource not found");
    }

    try {
      assertPlayerAttachmentAccess(ctx, record);
    } catch (error) {
      rethrowPermissionError(error);
    }
  }

  async function assertCanAccessInjury(ctx: AuthContext, injuryId: string) {
    const record = await queries.findInjuryAccessRecord(injuryId);

    if (!record) {
      throw new AuthError(404, "Resource not found");
    }

    try {
      assertPlayerResourceAccess(ctx, record);
    } catch (error) {
      rethrowPermissionError(error);
    }
  }

  async function assertCanReadDrill(ctx: AuthContext, drillId: string) {
    const record = await queries.findDrillAccessRecord(drillId);

    if (!record) {
      throw new AuthError(404, "Resource not found");
    }

    try {
      assertCanReadCoachResource(ctx, record.facilityId);
    } catch (error) {
      rethrowPermissionError(error);
    }
  }

  async function assertCanEditDrill(ctx: AuthContext, drillId: string) {
    const record = await queries.findDrillAccessRecord(drillId);

    if (!record) {
      throw new AuthError(404, "Resource not found");
    }

    try {
      assertCanEditCoachOwnedResource(ctx, record);
    } catch (error) {
      rethrowPermissionError(error);
    }
  }

  async function assertCanReadUniversalRoutine(
    ctx: AuthContext,
    routineId: string
  ) {
    const record = await queries.findUniversalRoutineAccessRecord(routineId);

    if (!record) {
      throw new AuthError(404, "Resource not found");
    }

    try {
      assertCanReadCoachResource(ctx, record.facilityId);
    } catch (error) {
      rethrowPermissionError(error);
    }
  }

  async function assertCanEditUniversalRoutine(
    ctx: AuthContext,
    routineId: string
  ) {
    const record = await queries.findUniversalRoutineAccessRecord(routineId);

    if (!record) {
      throw new AuthError(404, "Resource not found");
    }

    try {
      assertCanEditCoachOwnedResource(ctx, record);
    } catch (error) {
      rethrowPermissionError(error);
    }
  }

  async function getScopedPlayerIdsForFacility(facilityId: string) {
    return queries.listPlayerIdsForFacility(facilityId);
  }

  async function getPlayerInFacilityByUserId(userId: string, facilityId: string) {
    return queries.findPlayerInFacilityByUserId(userId, facilityId);
  }

  return {
    getAuthContext,
    requireRole,
    assertFacilityAccess,
    assertPlayerAccess,
    assertCanAccessLesson,
    assertCanAccessAttachment,
    assertCanAccessInjury,
    assertCanReadDrill,
    assertCanEditDrill,
    assertCanReadUniversalRoutine,
    assertCanEditUniversalRoutine,
    getScopedPlayerIdsForFacility,
    getPlayerInFacilityByUserId,
  };
}
