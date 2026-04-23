import { auth } from "@/auth";
import { createClientAuthApi } from "@ams/auth/client-auth";

import { clientAuthQueries } from "./auth-queries";

export const {
  getClientAuthContext,
  getOptionalClientAuthContext,
  requireClientPortalAccess,
} = createClientAuthApi({ getSession: auth, queries: clientAuthQueries });

export type { ClientAuthContext } from "@ams/auth/client-auth";
