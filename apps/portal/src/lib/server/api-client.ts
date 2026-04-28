import "server-only";

import { createInternalApiToken } from "@ams/auth/internal-api-token";

import { auth } from "@/auth";
import { AuthError } from "@/application/auth/auth-context";
import { env } from "@/env/server";

const INTERNAL_API_ISSUER = "portal";
const INTERNAL_API_AUDIENCE = "api";

type InternalApiActor = {
  userId: string;
  email: string | null;
};

function buildApiUrl(path: string) {
  return new URL(path, env.API_BASE_URL).toString();
}

export async function getPortalInternalApiActor(): Promise<InternalApiActor> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new AuthError(401, "Unauthorized");
  }

  return {
    userId,
    email: session.user.email ?? null,
  };
}

export function createPortalInternalApiToken(ctx: InternalApiActor) {
  return createInternalApiToken({
    secret: env.API_INTERNAL_AUTH_SECRET,
    issuer: INTERNAL_API_ISSUER,
    audience: INTERNAL_API_AUDIENCE,
    userId: ctx.userId,
    email: ctx.email,
  });
}

export async function fetchInternalApi(
  ctx: InternalApiActor,
  path: string,
  init: RequestInit = {}
) {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${createPortalInternalApiToken(ctx)}`);

  return fetch(buildApiUrl(path), {
    ...init,
    headers,
  });
}
