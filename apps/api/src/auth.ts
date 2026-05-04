import { headers } from "next/headers";

import { verifyInternalApiToken } from "@ams/auth/internal-api-token";
import type { SessionLike } from "@ams/auth/session";

import { env } from "@/env/server";

export type InternalApiIssuer = "ams" | "portal";

const INTERNAL_API_ISSUERS: InternalApiIssuer[] = ["ams", "portal"];
const INTERNAL_API_AUDIENCE = "api";

// Legacy identity headers are intentionally rejected. User identity must come
// from a signed internal bearer token, not raw client-supplied headers.
export const UNSAFE_IDENTITY_HEADERS = {
  userId: "x-ams-user-id",
  email: "x-ams-user-email",
} as const;

function getBearerToken(authorization: string | null) {
  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

export async function auth(): Promise<SessionLike> {
  const requestHeaders = await headers();

  if (
    requestHeaders.has(UNSAFE_IDENTITY_HEADERS.userId) ||
    requestHeaders.has(UNSAFE_IDENTITY_HEADERS.email)
  ) {
    return null;
  }

  const token = getBearerToken(requestHeaders.get("authorization"));
  if (!token) {
    return null;
  }

  const issuerVerifiedPayloads = INTERNAL_API_ISSUERS.map((issuer) => {
    const payload = verifyInternalApiToken({
      token,
      secret: env.API_INTERNAL_AUTH_SECRET,
      expectedIssuer: issuer,
      expectedAudience: INTERNAL_API_AUDIENCE,
    });

    return payload ? { issuer, payload } : null;
  });

  const verified = issuerVerifiedPayloads.find(Boolean);
  const userId = verified?.payload.sub ?? null;
  const email = verified?.payload.email ?? null;

  if (!userId && !email) {
    return null;
  }

  return {
    user: {
      id: userId,
      email,
      issuer: verified?.issuer ?? null,
    },
  };
}
