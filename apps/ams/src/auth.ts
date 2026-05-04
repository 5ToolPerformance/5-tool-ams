import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { and, eq } from "drizzle-orm";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

import {
  applyActorToSession,
  applyActorToToken,
  clearActorTokenClaims,
  loadAuthSessionStateSafely,
} from "@ams/auth";
import { createAuthSessionQueries } from "@ams/application/auth/db-queries";
import db from "@ams/db";
import { allowedUsers } from "@ams/db/schema";
import { DEFAULT_ORGANIZATION_ID } from "@ams/domain/organizations/constants";
import { env } from "@/env/server";

const authSessionQueries = createAuthSessionQueries();

function sanitizeCallbackError(error: unknown) {
  if (!(error instanceof Error)) {
    return { name: "UnknownError" };
  }

  return {
    name: error.name,
    message: error.message.replace(
      /postgres(?:ql)?:\/\/[^\s"'<>]+/gi,
      "postgres://[redacted]"
    ),
  };
}

async function canUseGoogleSignIn(email: string) {
  try {
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
  } catch (error) {
    console.error("auth.sign_in_allowed_user_lookup_failed", {
      provider: "google",
      error: sanitizeCallbackError(error),
    });

    return false;
  }
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

      const state = await loadAuthSessionStateSafely(
        tokenUserId,
        authSessionQueries
      );
      if (!state) {
        return clearActorTokenClaims(token);
      }

      return applyActorToToken(token, state);
    },
    async session({ session, token }) {
      return applyActorToSession(session, token);
    },
  },
});
