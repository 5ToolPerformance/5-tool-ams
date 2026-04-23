import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { and, eq } from "drizzle-orm";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

import {
  applyActorToSession,
  applyActorToToken,
  loadAuthSessionState,
  type AuthSessionQueries,
} from "@ams/auth";
import db from "@ams/db";
import { allowedUsers, playerInformation, userRoles, users } from "@ams/db/schema";
import { DEFAULT_ORGANIZATION_ID } from "@ams/domain/organizations/constants";
import { env } from "@/env/server";

const authSessionQueries: AuthSessionQueries = {
  async findActorIdentity(userId) {
    const [identity] = await db
      .select({
        id: users.id,
        email: users.email,
        systemRole: users.systemRole,
        role: users.role,
        access: users.access,
        isActive: users.isActive,
        facilityId: users.facilityId,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return identity ?? null;
  },
  async listMemberships(userId) {
    return db
      .select({
        facilityId: userRoles.facilityId,
        role: userRoles.role,
        access: userRoles.access,
        isActive: userRoles.isActive,
      })
      .from(userRoles)
      .where(eq(userRoles.userId, userId));
  },
  async findPlayerIdByUserId(userId) {
    const [player] = await db
      .select({ id: playerInformation.id })
      .from(playerInformation)
      .where(eq(playerInformation.userId, userId))
      .limit(1);

    return player?.id ?? null;
  },
};

async function canUseGoogleSignIn(email: string) {
  const [allowed] = await db
    .select({ id: allowedUsers.id })
    .from(allowedUsers)
    .where(
      and(
        eq(allowedUsers.email, email),
        eq(allowedUsers.provider, "google"),
        eq(allowedUsers.status, "active"),
        eq(allowedUsers.organizationId, DEFAULT_ORGANIZATION_ID)
      )
    )
    .limit(1);

  return Boolean(allowed);
}

const asString = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    MicrosoftEntraID({
      clientId: env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!account) {
        return false;
      }

      const email = user.email?.toLowerCase();
      if (!email) {
        return false;
      }

      if (account.provider === "microsoft-entra-id") {
        return true;
      }

      if (account.provider === "google") {
        return canUseGoogleSignIn(email);
      }

      return false;
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
