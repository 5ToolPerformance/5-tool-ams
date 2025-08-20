import { NextRequest, NextResponse } from "next/server";

import { PlayerService } from "@/lib/services/players";
import { RouteParams } from "@/types/api";
import { PlayerInsert } from "@/types/database";

export async function GET(
  request: NextRequest,
  { params }: RouteParams<{ id: string }>
) {
  try {
    const { id } = await params;

    // Validate player ID
    if (!id) {
      return NextResponse.json(
        { error: "Player ID is required" },
        { status: 400 }
      );
    }

    // Get lessons for the player
    const player = await PlayerService.getPlayerById(id);

    return NextResponse.json({
      success: true,
      data: player,
    });
    
  } catch (error) {
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
    const { id } = await params;

    // Validate player ID
    if (!id) {
      return NextResponse.json(
        { error: "Player ID is required" },
        { status: 400 }
      );
    }

    const body: Partial<PlayerInsert> = await request.json();

    const updated = await PlayerService.updatePlayerInformation(id, body);

    return NextResponse.json({
      success: true,
      data: updated,
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
