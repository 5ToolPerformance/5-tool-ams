import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { createPlayer } from "@/db/queries/players/createPlayer";
import { PlayerUpsertInput } from "@/domain/player/types";
import { PlayerService } from "@/lib/services/players";

export async function GET() {
  const session = await auth();

  if (!session || !["coach", "admin"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const allPlayers = await PlayerService.getAllPlayersWithInformation();

  return NextResponse.json({
    success: true,
    data: allPlayers,
  });
}

export async function POST(request: NextRequest) {
  try {
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

    const player = await createPlayer(body);

    return NextResponse.json({
      success: true,
      data: player,
      message: "Player created successfully",
    });
  } catch (error) {
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
