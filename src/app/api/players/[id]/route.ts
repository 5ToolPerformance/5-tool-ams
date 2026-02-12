import { NextRequest, NextResponse } from "next/server";

import { updatePlayer } from "@/db/queries/players/updatePlayer";
import { PlayerUpsertInput } from "@/domain/player/types";
import { assertPlayerAccess, getAuthContext } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { PlayerService } from "@/lib/services/players";
import { RouteParams } from "@/types/api";

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

    // Get lessons for the player
    await assertPlayerAccess(ctx, id);
    const player = await PlayerService.getPlayerByIdScoped(id, ctx.facilityId);

    return NextResponse.json({
      success: true,
      data: player,
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Error fetching player by id:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch player",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams<{ id: string }>
) {
  try {
    const ctx = await getAuthContext();
    const { id } = await params;

    // Validate player ID
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Player ID is required" },
        { status: 400 }
      );
    }

    await assertPlayerAccess(ctx, id);
    const body: Partial<PlayerUpsertInput> = await request.json();

    await updatePlayer(id, body);

    return NextResponse.json({
      success: true,
      message: "Player updated successfully",
    });
  } catch (error) {
    console.error("Error updating player by id:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update player",
      },
      { status: 500 }
    );
  }
}
