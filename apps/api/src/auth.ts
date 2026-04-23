import { headers } from "next/headers";

import type { SessionLike } from "@ams/auth/session";

export const API_AUTH_HEADERS = {
  userId: "x-ams-user-id",
  email: "x-ams-user-email",
} as const;

export async function auth(): Promise<SessionLike> {
  const requestHeaders = await headers();
  const userId = requestHeaders.get(API_AUTH_HEADERS.userId);
  const email = requestHeaders.get(API_AUTH_HEADERS.email);

  if (!userId && !email) {
    return null;
  }

  return {
    user: {
      id: userId,
      email,
    },
  };
}
