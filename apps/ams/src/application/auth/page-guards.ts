import { createPageGuardsApi } from "@ams/auth/page-guards";

import { getAuthContext } from "./auth-context";

export const { requirePlayerRouteAccess, requireNonPlayerForAdminArea } =
  createPageGuardsApi({ getAuthContext });
