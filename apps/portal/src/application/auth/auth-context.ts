import { auth } from "@/auth";
import { createAuthContextApi } from "@ams/auth/auth-context";

import { authContextQueries } from "./auth-queries";

export const {
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
} = createAuthContextApi({ getSession: auth, queries: authContextQueries });

export type { AppRole, AuthContext } from "@ams/auth/auth-context";
export { AuthError } from "@ams/auth/auth-context";
