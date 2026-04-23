import { DefaultSession, DefaultUser } from "next-auth";
import type {
  Actor,
  ActorMembership,
  MembershipAccess,
  SystemRole,
} from "@ams/auth/actor";

declare module "next-auth" {
  interface Session {
    user: {
      role?: "player" | "coach" | "admin";
      portalRole?: "client";
      isPortalClient?: boolean;
      id?: string;
      facilityId?: string;
      playerId?: string | null;
      access?: MembershipAccess;
      systemRole?: SystemRole;
      memberships?: ActorMembership[];
      actor?: Actor;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: "player" | "coach" | "admin";
    portalRole?: "client";
    isPortalClient?: boolean;
    id?: string;
    facilityId?: string;
    playerId?: string | null;
    access?: MembershipAccess;
    systemRole?: SystemRole;
    memberships?: ActorMembership[];
    actor?: Actor;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "player" | "coach" | "admin";
    portalRole?: "client";
    isPortalClient?: boolean;
    facilityId?: string;
    playerId?: string | null;
    access?: MembershipAccess;
    systemRole?: SystemRole;
    memberships?: ActorMembership[];
    actor?: Actor;
  }
}
