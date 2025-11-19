import { NextRequest, NextResponse } from "next/server";

import { playerRepository } from "@/lib/services/repository/players";
import { RouteParams } from "@/types/api";
import { PlayerInjuryInsert } from "@/types/database";

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams<{ id: string; injuryId: string }>
) {
  try {
    const body: Partial<PlayerInjuryInsert> = await request.json();
    const { injuryId } = await params;
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
