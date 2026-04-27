import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { and, eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";

import {
  applyActorToSession,
  applyActorToToken,
  loadAuthSessionState,
} from "@ams/auth";
import { createAuthSessionQueries } from "@ams/application/auth/db-queries";
import db from "@ams/db";
import { clientInvites, userRoles, users } from "@ams/db/schema";
import { env } from "@/env/server";

const authSessionQueries = createAuthSessionQueries();

async function canUsePortalMagicLink(email: string) {
  const normalizedEmail = email.toLowerCase();

  const [existingUser] = await db
    .select({
      id: users.id,
      role: users.role,
    })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existingUser?.role) {
    return false;
  }

  const [existingClientRole] = existingUser
    ? await db
        .select({ id: userRoles.id })
        .from(userRoles)
        .where(
          and(eq(userRoles.userId, existingUser.id), eq(userRoles.role, "client"))
        )
        .limit(1)
    : [];

  if (existingClientRole) {
    return true;
  }

  const [pendingInvite] = await db
    .select({ id: clientInvites.id })
    .from(clientInvites)
    .where(
      and(
        eq(clientInvites.email, normalizedEmail),
        eq(clientInvites.status, "pending")
      )
    )
    .limit(1);

  return Boolean(pendingInvite);
}

const asString = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: env.AUTH_SECRET,
  providers: [
    Resend({
      apiKey: env.AUTH_RESEND_KEY,
      from: env.AUTH_RESEND_FROM,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!account || account.provider !== "resend") {
        return false;
      }

      const email = user.email?.toLowerCase();
      if (!email) {
        return false;
      }

      return canUsePortalMagicLink(email);
    },
    async jwt({ token }) {
      const tokenUserId = asString(token.sub) ?? asString(token.id);
      if (!tokenUserId) {
        return token;
      }

      const state = await loadAuthSessionState(tokenUserId, authSessionQueries);
      if (!state) {
        return token;
      }

      return applyActorToToken(token, state);
    },
    async session({ session, token }) {
      return applyActorToSession(session, token);
    },
  },
});
