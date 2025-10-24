import { NextRequest, NextResponse } from "next/server";

import { coachRepository } from "@/lib/services/repository/coaches";
import { RouteParams } from "@/types/api";

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
    const counts = await coachRepository.findCoachPlayerLessonCounts(id);

    return NextResponse.json({ counts });
  } catch (error) {
    console.error("Error fetching lesson counts for coach:", error);

    return NextResponse.json(
      { error: "Failed to fetch lesson counts" },
      { status: 500 }
    );
  }
}
