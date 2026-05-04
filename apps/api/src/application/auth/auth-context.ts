import { auth } from "@/auth";
import { AuthError, createAuthContextApi } from "@ams/auth/auth-context";
import type { InternalApiIssuer } from "@/auth";

import { authContextQueries } from "./auth-queries";

const authContextApi = createAuthContextApi({
  getSession: auth,
  queries: authContextQueries,
});

export function requireApiIssuer(
  ctx: { issuer: InternalApiIssuer | null },
  allowedIssuers: InternalApiIssuer[]
) {
  if (!ctx.issuer || !allowedIssuers.includes(ctx.issuer)) {
    throw new AuthError(403, "Forbidden");
  }
}

async function getAuthContextForIssuers(allowedIssuers: InternalApiIssuer[]) {
  const ctx = await authContextApi.getAuthContext();
  requireApiIssuer(ctx, allowedIssuers);
  return ctx;
}

export function getAuthContext() {
  return getAuthContextForIssuers(["ams"]);
}

export function getAmsAuthContext() {
  return getAuthContextForIssuers(["ams"]);
}

export function getPortalAuthContext() {
  return getAuthContextForIssuers(["portal"]);
}

export const {
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
} = authContextApi;

export type { AppRole, AuthContext } from "@ams/auth/auth-context";
export { AuthError } from "@ams/auth/auth-context";
