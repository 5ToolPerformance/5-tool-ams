import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

import db from "@/db";
import { users } from "@/db/schema";
import { env } from "@/env/server";

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
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
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
