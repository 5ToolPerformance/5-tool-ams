import { NextResponse } from "next/server";

import {
  getClientAccessForPlayer,
  getClientPortalContext,
} from "@ams/application/client-portal/service";
import { AuthError } from "@ams/auth/auth-context";
import { getClientAuthContext } from "@/application/auth/client-auth";

export type PortalApiContext = {
  userId: string;
  email: string;
  facilityId: string;
  portalRole: "client";
};

export async function requirePortalApiContext(): Promise<PortalApiContext> {
  return getClientAuthContext();
}

export async function assertPortalPlayerAccess(
  ctx: PortalApiContext,
  playerId: string
) {
  const access = await getClientAccessForPlayer(ctx.userId, ctx.facilityId, playerId);

  if (!access || access.status !== "active" || !access.permissions.canView) {
    return null;
  }

  return access;
}

export async function requireSelectedPortalPlayer(
  ctx: PortalApiContext,
  requestedPlayerId?: string | null
) {
  const context = await getClientPortalContext(
    ctx.userId,
    ctx.facilityId,
    requestedPlayerId
  );

  if (!context.selectedPlayerId) {
    return { context, playerId: null };
  }

  const access = await assertPortalPlayerAccess(ctx, context.selectedPlayerId);
  if (!access) {
    return { context, playerId: null };
  }

  return { context, playerId: context.selectedPlayerId };
}

export function portalNotFound() {
  return NextResponse.json({ error: "Resource not found" }, { status: 404 });
}

export function portalApiError(error: unknown) {
  if (error instanceof AuthError) {
    return NextResponse.json(
      { error: error.status === 401 ? "Unauthorized" : "Forbidden" },
      { status: error.status }
    );
  }

  return NextResponse.json({ error: "Portal request failed" }, { status: 500 });
}
