import { NextRequest, NextResponse } from "next/server";

import { PlayerService } from "@/lib/services/players";
import { PlayerInformation } from "@/types/users";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    const playerInfo = await PlayerService.getPlayerInformationById(id);

    return NextResponse.json({ playerInfo });
  } catch (error) {
    console.error("Error fetching player information for player:", error);

    return NextResponse.json(
      { error: "Failed to fetch player information" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body: PlayerInformation = await request.json();
    const playerInfo = await PlayerService.createPlayerInformation(id, body);

    return NextResponse.json({
      success: true,
      data: playerInfo,
      message: "Player Information created successfully",
    });
  } catch (error) {
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
