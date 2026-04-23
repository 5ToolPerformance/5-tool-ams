import { redirect } from "next/navigation";

import type { ClientPortalRole } from "@ams/domain/client-portal/types";

import {
  buildActor,
  findPrimaryPortalMembership,
  type ActorIdentityRecord,
  type ActorMembershipRecord,
} from "./actor";
import { AuthError, type SessionLookup } from "./auth-context";
import type { SessionGetter } from "./session";

export type ClientAuthContext = {
  userId: string;
  email: string;
  facilityId: string;
  portalRole: ClientPortalRole;
};

export type ClientAuthQueries = {
  findUserForSession(
    lookup: SessionLookup
  ): Promise<ActorIdentityRecord | null>;
  listMembershipsForUser(userId: string): Promise<ActorMembershipRecord[]>;
};

export type ClientAuthDependencies = {
  getSession: SessionGetter;
  queries: ClientAuthQueries;
};

function toSessionLookup(session: Awaited<ReturnType<SessionGetter>>): SessionLookup {
  return {
    userId: session?.user?.id ?? null,
    email: session?.user?.email?.toLowerCase() ?? null,
  };
}

export function createClientAuthApi({
  getSession,
  queries,
}: ClientAuthDependencies) {
  async function getClientAuthContext(): Promise<ClientAuthContext> {
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
    const clientRole = findPrimaryPortalMembership(actor);

    if (!clientRole || clientRole.role !== "client") {
      throw new AuthError(403, "Portal access denied");
    }

    return {
      userId: dbUser.id,
      email: dbUser.email ?? "",
      facilityId: clientRole.facilityId,
      portalRole: clientRole.role as ClientPortalRole,
    };
  }

  async function getOptionalClientAuthContext(): Promise<ClientAuthContext | null> {
    try {
      return await getClientAuthContext();
    } catch (error) {
      if (error instanceof AuthError && (error.status === 401 || error.status === 403)) {
        return null;
      }

      throw error;
    }
  }

  async function requireClientPortalAccess() {
    try {
      return await getClientAuthContext();
    } catch (error) {
      if (
        error instanceof AuthError &&
        (error.status === 401 || error.status === 403)
      ) {
        redirect("/");
      }

      throw error;
    }
  }

  return {
    getClientAuthContext,
    getOptionalClientAuthContext,
    requireClientPortalAccess,
  };
}
