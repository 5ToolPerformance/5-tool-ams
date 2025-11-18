import { NextRequest, NextResponse } from "next/server";

import { playerRepository } from "@/lib/services/repository/players";
import { PlayerInjuryInsert } from "@/types/database";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const injury = await playerRepository.findPlayerInjuryByPlayerId(id);

    return NextResponse.json({
      success: true,
      data: injury,
      message: "Injury Fetched Successfully",
    });
  } catch (error) {
    console.error("Error in GET /api/player/[id]/injury:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: PlayerInjuryInsert = await request.json();
    const injury = await playerRepository.createPlayerInjury(body);

    return NextResponse.json({
      success: true,
      data: injury,
      message: "Injury Created Successfully",
    });
  } catch (error) {
    console.error("Error in POST /api/player/[id]/injury:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
