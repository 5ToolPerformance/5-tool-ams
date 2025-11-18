import { NextRequest, NextResponse } from "next/server";

import { playerRepository } from "@/lib/services/repository/players";
import { PlayerInjuryInsert } from "@/types/database";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; injuryId: string } }
) {
  try {
    const body: PlayerInjuryInsert = await request.json();
    const injuryId = params.injuryId;
    const injury = await playerRepository.updatePlayerInjury(injuryId, body);

    return NextResponse.json({
      success: true,
      data: injury,
      message: "Injury Updated Successfully",
    });
  } catch (error) {
    console.error("Error in PATCH /api/player/[id]/injury/[injuryId]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
