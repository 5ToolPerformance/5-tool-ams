import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { PlayerService } from "@/lib/services/players";
import { PlayerInsert } from "@/types/database";

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
    const body: PlayerInsert = await request.json();
    const player = await PlayerService.createPlayerInformation(body);

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
