import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

import type { Actor } from "./actor";
import {
  buildActor,
  findPrimaryAppMembership,
  findPrimaryPortalMembership,
  type ActorIdentityRecord,
  type ActorMembershipRecord,
} from "./actor";

export type AuthSessionQueries = {
  findActorIdentity(userId: string): Promise<ActorIdentityRecord | null>;
  listMemberships(userId: string): Promise<ActorMembershipRecord[]>;
  findPlayerIdByUserId(userId: string): Promise<string | null>;
};

export type AuthSessionState = {
  actor: Actor;
  playerId: string | null;
};

export type AuthSessionLogger = {
  error(message: string, context?: Record<string, unknown>): void;
};

function sanitizeError(error: unknown) {
  if (!(error instanceof Error)) {
    return {
      name: "UnknownError",
      message: "Unknown auth session lookup error",
    };
  }

  return {
    name: error.name,
    message: redactErrorMessage(error.message),
    code:
      "code" in error && typeof error.code === "string"
        ? error.code
        : undefined,
    cause:
      error.cause instanceof Error
        ? {
            name: error.cause.name,
            message: redactErrorMessage(error.cause.message),
          }
        : undefined,
  };
}

function redactErrorMessage(message: string) {
  return message.replace(
    /postgres(?:ql)?:\/\/[^\s"'<>]+/gi,
    "postgres://[redacted]"
  );
}

export async function loadAuthSessionState(
  userId: string,
  queries: AuthSessionQueries
): Promise<AuthSessionState | null> {
  const [identity, memberships, playerId] = await Promise.all([
    queries.findActorIdentity(userId),
    queries.listMemberships(userId),
    queries.findPlayerIdByUserId(userId),
  ]);

  if (!identity) {
    return null;
  }

  return {
    actor: buildActor(identity, memberships),
    playerId,
  };
}

export async function loadAuthSessionStateSafely(
  userId: string,
  queries: AuthSessionQueries,
  logger: AuthSessionLogger = console
): Promise<AuthSessionState | null> {
  try {
    return await loadAuthSessionState(userId, queries);
  } catch (error) {
    logger.error("auth.session_lookup_failed", {
      userId,
      error: sanitizeError(error),
    });

    return null;
  }
}

export function clearActorTokenClaims(token: JWT) {
  delete token.actor;
  delete token.systemRole;
  delete token.memberships;
  delete token.role;
  delete token.portalRole;
  delete token.isPortalClient;
  delete token.facilityId;
  delete token.access;
  delete token.playerId;

  return token;
}

export function applyActorToToken(
  token: JWT,
  state: AuthSessionState
) {
  const appMembership = findPrimaryAppMembership(state.actor);
  const portalMembership = findPrimaryPortalMembership(state.actor);

  token.id = state.actor.userId;
  token.sub = state.actor.userId;
  token.email = state.actor.email ?? undefined;
  token.actor = state.actor;
  token.systemRole = state.actor.systemRole;
  token.memberships = state.actor.memberships;
  token.role = appMembership?.role;
  token.portalRole = portalMembership?.role;
  token.isPortalClient = Boolean(portalMembership);
  token.facilityId =
    appMembership?.facilityId ?? portalMembership?.facilityId ?? undefined;
  token.access = appMembership?.access ?? portalMembership?.access ?? undefined;
  token.playerId = state.playerId;

  return token;
}

export function applyActorToSession(
  session: Session,
  token: JWT
) {
  const user = session.user as Session["user"] & {
    actor?: Actor;
    systemRole?: "standard" | "super_admin";
    memberships?: Actor["memberships"];
    access?: "read/write" | "read-only" | "write-only";
    role?: "player" | "coach" | "admin";
    portalRole?: "client";
    isPortalClient?: boolean;
    id?: string;
    facilityId?: string;
    playerId?: string | null;
  };

  session.user = user;
  user.id =
    typeof token.id === "string"
      ? token.id
      : typeof token.sub === "string"
        ? token.sub
        : undefined;
  user.email = typeof token.email === "string" ? token.email : null;
  user.actor = token.actor as Actor | undefined;
  user.systemRole =
    token.systemRole === "super_admin" ? "super_admin" : "standard";
  user.memberships = Array.isArray(token.memberships)
    ? (token.memberships as Actor["memberships"])
    : [];
  user.role =
    token.role === "player" || token.role === "coach" || token.role === "admin"
      ? token.role
      : undefined;
  user.portalRole = token.portalRole === "client" ? "client" : undefined;
  user.isPortalClient = Boolean(token.isPortalClient);
  user.facilityId =
    typeof token.facilityId === "string" ? token.facilityId : undefined;
  user.access =
    token.access === "read/write" ||
    token.access === "read-only" ||
    token.access === "write-only"
      ? token.access
      : undefined;
  user.playerId =
    typeof token.playerId === "string" ? token.playerId : null;

  return session;
}
