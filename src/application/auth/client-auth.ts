import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import db from "@/db";
import { userRoles, users } from "@/db/schema";
import type { ClientPortalRole } from "@/domain/client-portal/types";

import { AuthError } from "./auth-context";

export type ClientAuthContext = {
  userId: string;
  email: string;
  facilityId: string;
  portalRole: ClientPortalRole;
};

export async function getClientAuthContext(): Promise<ClientAuthContext> {
  const session = await auth();
  const sessionUserId = session?.user?.id;
  const sessionEmail = session?.user?.email?.toLowerCase();

  if (!sessionUserId && !sessionEmail) {
    throw new AuthError(401, "Unauthorized");
  }

  const [dbUser] =
    sessionUserId
      ? await db
          .select({
            id: users.id,
            email: users.email,
          })
          .from(users)
          .where(eq(users.id, sessionUserId))
          .limit(1)
      : await db
          .select({
            id: users.id,
            email: users.email,
          })
          .from(users)
          .where(eq(users.email, sessionEmail!))
          .limit(1);

  if (!dbUser) {
    throw new AuthError(401, "Unauthorized");
  }

  const [clientRole] = await db
    .select({
      facilityId: userRoles.facilityId,
      role: userRoles.role,
    })
    .from(userRoles)
    .where(and(eq(userRoles.userId, dbUser.id), eq(userRoles.role, "client")))
    .limit(1);

  if (!clientRole) {
    throw new AuthError(403, "Portal access denied");
  }

  return {
    userId: dbUser.id,
    email: dbUser.email,
    facilityId: clientRole.facilityId,
    portalRole: "client",
  };
}

export async function getOptionalClientAuthContext(): Promise<ClientAuthContext | null> {
  try {
    return await getClientAuthContext();
  } catch (error) {
    if (error instanceof AuthError && (error.status === 401 || error.status === 403)) {
      return null;
    }

    throw error;
  }
}

export async function requireClientPortalAccess() {
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
