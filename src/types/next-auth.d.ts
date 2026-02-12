import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role?: "player" | "coach" | "admin";
      id?: string;
      facilityId?: string;
      playerId?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: "player" | "coach" | "admin";
    id?: string;
    facilityId?: string;
    playerId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "player" | "coach" | "admin";
    facilityId?: string;
    playerId?: string | null;
  }
}
