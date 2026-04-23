export type PermissionRole = "player" | "coach" | "admin";
export type PermissionAccess = "read/write" | "read-only" | "write-only";
export type SystemRole = "standard" | "super_admin";

export type PermissionContext = {
  userId: string;
  role: PermissionRole;
  facilityId: string;
  playerId: string | null;
  access?: PermissionAccess;
  systemRole?: SystemRole;
};

export class PermissionError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function requireRole(
  ctx: PermissionContext,
  roles: PermissionRole[]
) {
  if (ctx.systemRole === "super_admin") {
    return;
  }

  if (!roles.includes(ctx.role)) {
    throw new PermissionError(403, "Forbidden");
  }
}

export function assertFacilityAccess(
  ctx: PermissionContext,
  resourceFacilityId: string | null
) {
  if (ctx.systemRole === "super_admin") {
    return;
  }

  if (!resourceFacilityId || resourceFacilityId !== ctx.facilityId) {
    throw new PermissionError(404, "Resource not found");
  }
}

export function assertPlayerResourceAccess(
  ctx: PermissionContext,
  resource: {
    playerId: string;
    facilityId: string | null;
  }
) {
  if (ctx.systemRole === "super_admin") {
    return;
  }

  if (ctx.role === "player") {
    if (ctx.playerId !== resource.playerId) {
      throw new PermissionError(403, "Forbidden");
    }
    return;
  }

  assertFacilityAccess(ctx, resource.facilityId);
}

export function assertPlayerAttachmentAccess(
  ctx: PermissionContext,
  resource: {
    playerId: string | null;
    facilityId: string | null;
  }
) {
  if (ctx.systemRole === "super_admin") {
    return;
  }

  if (ctx.role === "player") {
    if (!resource.playerId || ctx.playerId !== resource.playerId) {
      throw new PermissionError(403, "Forbidden");
    }
    return;
  }

  assertFacilityAccess(ctx, resource.facilityId);
}

export function assertCanReadCoachResource(
  ctx: PermissionContext,
  resourceFacilityId: string | null
) {
  if (ctx.systemRole === "super_admin") {
    return;
  }

  if (ctx.role === "player") {
    throw new PermissionError(403, "Forbidden");
  }

  assertFacilityAccess(ctx, resourceFacilityId);
}

export function assertCanEditCoachOwnedResource(
  ctx: PermissionContext,
  resource: {
    createdBy: string;
    facilityId: string | null;
  }
) {
  assertCanReadCoachResource(ctx, resource.facilityId);

  if (ctx.role === "coach" && resource.createdBy !== ctx.userId) {
    throw new PermissionError(403, "Forbidden");
  }
}
