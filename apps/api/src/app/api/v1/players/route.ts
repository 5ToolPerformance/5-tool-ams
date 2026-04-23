import { NextRequest, NextResponse } from "next/server";

import { createPlayer } from "@ams/db/queries/players/createPlayer";
import { PlayerUpsertInput } from "@ams/domain/player/types";
import { getAuthContext, requireRole } from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";
import { createMotorPreferences, createPlayerInformation, getAllPlayersWithInformationScoped, getMotorPreferencesById, getPlayerById, getPlayerByIdScoped, getPlayerInformationById } from "@ams/application/players/playerFunctions";

export async function GET() {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const allPlayers = await getAllPlayersWithInformationScoped(
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
