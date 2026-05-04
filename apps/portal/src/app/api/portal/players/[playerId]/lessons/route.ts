import { NextResponse } from "next/server";

import { getClientPlayerProfile } from "@ams/application/client-portal/service";
import {
  assertPortalPlayerAccess,
  portalApiError,
  portalNotFound,
  requirePortalApiContext,
} from "@/app/api/portal/_lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const ctx = await requirePortalApiContext();
    const { playerId } = await params;

    const access = await assertPortalPlayerAccess(ctx, playerId);
    if (!access) {
      return portalNotFound();
    }

    const profile = await getClientPlayerProfile(ctx.userId, ctx.facilityId, playerId);
    if (!profile) {
      return portalNotFound();
    }

    return NextResponse.json({ lessons: profile.recentLessons });
  } catch (error) {
    return portalApiError(error);
  }
}
