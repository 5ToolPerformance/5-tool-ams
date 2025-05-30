import { NextRequest, NextResponse } from "next/server";

import { PlayerService } from "@/lib/services/players";

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
