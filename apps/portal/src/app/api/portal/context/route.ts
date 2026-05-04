import { NextRequest, NextResponse } from "next/server";

import {
  portalApiError,
  requirePortalApiContext,
  requireSelectedPortalPlayer,
} from "@/app/api/portal/_lib/auth";

export async function GET(request: NextRequest) {
  try {
    const ctx = await requirePortalApiContext();
    const requestedPlayerId = request.nextUrl.searchParams.get("playerId");
    const { context, playerId } = await requireSelectedPortalPlayer(
      ctx,
      requestedPlayerId
    );

    return NextResponse.json({
      profile: context.profile,
      players: context.players,
      selectedPlayerId: playerId,
    });
  } catch (error) {
    return portalApiError(error);
  }
}
