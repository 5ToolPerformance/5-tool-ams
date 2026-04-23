export type AppRole = "player" | "coach" | "admin";
export type PortalRole = "client";
export type MembershipRole = AppRole | PortalRole;
export type MembershipAccess = "read/write" | "read-only" | "write-only";
export type SystemRole = "standard" | "super_admin";

export type ActorMembership = {
  facilityId: string;
  role: MembershipRole;
  access: MembershipAccess;
  isActive: boolean;
};

export type AppMembership = Omit<ActorMembership, "role"> & {
  role: AppRole;
};

export type PortalMembership = Omit<ActorMembership, "role"> & {
  role: PortalRole;
};

export type Actor = {
  userId: string;
  email: string | null;
  systemRole: SystemRole;
  memberships: ActorMembership[];
};

export type ActorIdentityRecord = {
  id: string;
  email: string | null;
  systemRole: string | null | undefined;
  role: string | null | undefined;
  access: string | null | undefined;
  isActive: boolean | null | undefined;
  facilityId: string | null;
};

export type ActorMembershipRecord = {
  facilityId: string | null;
  role: string | null | undefined;
  access: string | null | undefined;
  isActive: boolean | null | undefined;
};

export function isAppRole(role: string | null | undefined): role is AppRole {
  return role === "player" || role === "coach" || role === "admin";
}

export function isMembershipRole(
  role: string | null | undefined
): role is MembershipRole {
  return isAppRole(role) || role === "client";
}

export function isMembershipAccess(
  access: string | null | undefined
): access is MembershipAccess {
  return (
    access === "read/write" ||
    access === "read-only" ||
    access === "write-only"
  );
}

export function normalizeSystemRole(
  role: string | null | undefined
): SystemRole {
  return role === "super_admin" ? "super_admin" : "standard";
}

function normalizeMembership(
  membership: ActorMembershipRecord
): ActorMembership | null {
  if (!membership.facilityId || !isMembershipRole(membership.role)) {
    return null;
  }

  return {
    facilityId: membership.facilityId,
    role: membership.role,
    access: isMembershipAccess(membership.access)
      ? membership.access
      : "read/write",
    isActive: membership.isActive ?? true,
  };
}

function normalizeLegacyMembership(
  user: ActorIdentityRecord
): ActorMembership | null {
  if (!user.facilityId || !isAppRole(user.role)) {
    return null;
  }

  return {
    facilityId: user.facilityId,
    role: user.role,
    access: isMembershipAccess(user.access) ? user.access : "read/write",
    isActive: user.isActive ?? true,
  };
}

export function buildActor(
  user: ActorIdentityRecord,
  memberships: ActorMembershipRecord[]
): Actor {
  const normalizedMemberships = memberships
    .map((membership) => normalizeMembership(membership))
    .filter((membership): membership is ActorMembership => membership !== null);

  return {
    userId: user.id,
    email: user.email,
    systemRole: normalizeSystemRole(user.systemRole),
    memberships:
      normalizedMemberships.length > 0
        ? normalizedMemberships
        : normalizeLegacyMembership(user)
          ? [normalizeLegacyMembership(user)!]
          : [],
  };
}

export function findPrimaryMembership(
  actor: Actor,
  roles?: MembershipRole[]
): ActorMembership | null {
  const memberships =
    roles && roles.length > 0
      ? actor.memberships.filter((membership) => roles.includes(membership.role))
      : actor.memberships;

  return (
    memberships.find((membership) => membership.isActive) ??
    memberships[0] ??
    null
  );
}

export function findPrimaryAppMembership(actor: Actor) {
  const membership = findPrimaryMembership(actor, ["player", "coach", "admin"]);
  return membership && isAppRole(membership.role)
    ? ({ ...membership, role: membership.role } as AppMembership)
    : null;
}

export function findPrimaryPortalMembership(actor: Actor) {
  const membership = findPrimaryMembership(actor, ["client"]);
  return membership?.role === "client"
    ? ({ ...membership, role: membership.role } as PortalMembership)
    : null;
}
