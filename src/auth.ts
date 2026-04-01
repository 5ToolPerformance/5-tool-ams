import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { and, eq } from "drizzle-orm";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Resend from "next-auth/providers/resend";

import db from "@/db";
import {
  allowedUsers,
  clientInvites,
  playerInformation,
  userRoles,
  users,
} from "@/db/schema";
import { env } from "@/env/server";

import { DEFAULT_ORGANIZATION_ID } from "./lib/constants";

const normalizedRole = (
  value: unknown
): "player" | "coach" | "admin" | undefined => {
  if (value === "player" || value === "coach" || value === "admin") {
    return value;
  }
  return undefined;
};

const asString = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

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
          and(
            eq(userRoles.userId, existingUser.id),
            eq(userRoles.role, "client")
          )
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

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Resend({
      apiKey: env.AUTH_RESEND_KEY,
      from: env.AUTH_RESEND_FROM,
    }),
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
      if (!account) return false;

      // Normalize email for comparisons
      const email = user?.email?.toLowerCase();
      if (!email) return false;

      if (account.provider === "resend") {
        return canUsePortalMagicLink(email);
      }

      // Entra remains implicitly allowed (org boundary is the gate)
      if (account.provider === "microsoft-entra-id") {
        return true;
      }

      // Google must be explicitly allowed
      if (account.provider === "google") {
        // TODO: set your org id source of truth
        // For now, you can hardcode or read from env until you have orgs in DB.
        const organizationId = DEFAULT_ORGANIZATION_ID;

        const [allowed] = await db
          .select({ id: allowedUsers.id })
          .from(allowedUsers)
          .where(
            and(
              eq(allowedUsers.email, email),
              eq(allowedUsers.provider, "google"),
              eq(allowedUsers.status, "active"),
              eq(allowedUsers.organizationId, organizationId)
            )
          )
          .limit(1);

        return !!allowed;
      }

      // Any other provider: deny by default
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = normalizedRole(user.role);
        token.portalRole = user.portalRole;
        token.isPortalClient = user.isPortalClient;
        token.id = asString(user.id);
        token.facilityId = asString(user.facilityId);
        token.playerId = asString(user.playerId) ?? null;
      }

      const tokenUserId = asString(token.sub) ?? asString(token.id);
      if (!tokenUserId) {
        return token;
      }

      const [dbUser] = await db
        .select({
          id: users.id,
          role: users.role,
          facilityId: users.facilityId,
          email: users.email,
        })
        .from(users)
        .where(eq(users.id, tokenUserId))
        .limit(1);

      if (!dbUser) {
        return token;
      }

      token.id = dbUser.id;
      token.sub = dbUser.id;
      token.email = dbUser.email;
      token.role = dbUser.role ?? undefined;
      token.facilityId = dbUser.facilityId ?? undefined;

      const [clientRole] = await db
        .select({
          facilityId: userRoles.facilityId,
        })
        .from(userRoles)
        .where(
          and(eq(userRoles.userId, dbUser.id), eq(userRoles.role, "client"))
        )
        .limit(1);

      token.portalRole = clientRole ? "client" : undefined;
      token.isPortalClient = Boolean(clientRole);
      token.facilityId =
        dbUser.facilityId ?? clientRole?.facilityId ?? undefined;

      const [player] = await db
        .select({
          id: playerInformation.id,
        })
        .from(playerInformation)
        .where(eq(playerInformation.userId, dbUser.id))
        .limit(1);

      token.playerId = player?.id ?? null;

      return token;
    },
    async session({ session, token }) {
      if (!session.user?.email) return session;

      if (session.user) {
        const sessionUserId = asString(token.id) ?? asString(token.sub);
        if (sessionUserId) {
          session.user.id = sessionUserId;
        }
        session.user.role = normalizedRole(token.role);
        session.user.portalRole =
          token.portalRole === "client" ? "client" : undefined;
        session.user.isPortalClient = Boolean(token.isPortalClient);
        session.user.facilityId = asString(token.facilityId);
        session.user.playerId = asString(token.playerId) ?? null;
      }

      return session;
    },
  },
});
