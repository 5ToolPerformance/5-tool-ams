import { NextRequest, NextResponse } from "next/server";

import { createPlayer } from "@/db/queries/players/createPlayer";
import { PlayerUpsertInput } from "@/domain/player/types";
import { getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { PlayerService } from "@/lib/services/players";

export async function GET() {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const allPlayers = await PlayerService.getAllPlayersWithInformationScoped(
      ctx.facilityId
    );

    return NextResponse.json({
      success: true,
      data: allPlayers,
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const body: PlayerUpsertInput = await request.json();

    // minimal invariant checks (never trust the client)
    if (!body.firstName || !body.lastName) {
      return NextResponse.json(
        { success: false, error: "First and last name are required" },
        { status: 400 }
      );
    }

    if (!body.primaryPositionId) {
      return NextResponse.json(
        { success: false, error: "Primary position is required" },
        { status: 400 }
      );
    }

    const player = await createPlayer({
      ...body,
      facilityId: ctx.facilityId,
    });

    return NextResponse.json({
      success: true,
      data: player,
      message: "Player created successfully",
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    console.error("Error in POST /api/players:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
