import { NextRequest, NextResponse } from "next/server";

import { assertPlayerAccess, getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { PlayerService } from "@/lib/services/players";
import { RouteParams } from "@/types/api";
import { PlayerInsert } from "@/types/database";

export async function GET(
  request: NextRequest,
  { params }: RouteParams<{ id: string }>
) {
  try {
    const ctx = await getAuthContext();
    const { id } = await params;

    // Validate player ID
    if (!id) {
      return NextResponse.json(
        { error: "Player ID is required" },
        { status: 400 }
      );
    }

    await assertPlayerAccess(ctx, id);
    // Get lessons for the player
    const playerInfo = await PlayerService.getPlayerInformationById(id);

    return NextResponse.json({ playerInfo });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Error fetching player information for player:", error);

    return NextResponse.json(
      { error: "Failed to fetch player information" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const body: PlayerInsert = await request.json();
    const playerInfo = await PlayerService.createPlayerInformation({
      ...body,
      facilityId: ctx.facilityId,
    });

    return NextResponse.json({
      success: true,
      data: playerInfo,
      message: "Player Information created successfully",
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Error in POST /api/player/[id]/player-information:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
