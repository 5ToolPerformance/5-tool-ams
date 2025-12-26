import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { and, eq } from "drizzle-orm";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

import db from "@/db";
import { allowedUsers, users } from "@/db/schema";
import { env } from "@/env/server";

import { DEFAULT_ORGANIZATION_ID } from "./lib/constants";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
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
      if (!account) return false;

      // Normalize email for comparisons
      const email = user?.email?.toLowerCase();
      if (!email) return false;

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
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.user?.email) return session;

      if (token?.sub && session.user) {
        session.user.id = token.sub;
      }

      const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, session.user.email))
        .limit(1);

      if (dbUser) {
        session.user.role = dbUser.role ?? "user";
      } else {
        session.user.role = "user";
      }

      return session;
    },
  },
});
