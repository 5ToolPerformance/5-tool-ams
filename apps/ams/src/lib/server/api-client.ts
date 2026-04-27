import "server-only";

import { createInternalApiToken } from "@ams/auth/internal-api-token";

import type { AuthContext } from "@/application/auth/auth-context";
import { env } from "@/env/server";

const INTERNAL_API_ISSUER = "ams";
const INTERNAL_API_AUDIENCE = "api";

function buildApiUrl(path: string) {
  return new URL(path, env.API_BASE_URL).toString();
}

export function createAmsInternalApiToken(ctx: Pick<AuthContext, "userId" | "email">) {
  return createInternalApiToken({
    secret: env.API_INTERNAL_AUTH_SECRET,
    issuer: INTERNAL_API_ISSUER,
    audience: INTERNAL_API_AUDIENCE,
    userId: ctx.userId,
    email: ctx.email,
  });
}

export async function fetchInternalApi(
  ctx: Pick<AuthContext, "userId" | "email">,
  path: string,
  init: RequestInit = {}
) {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${createAmsInternalApiToken(ctx)}`);

  return fetch(buildApiUrl(path), {
    ...init,
    headers,
  });
}
