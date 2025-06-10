import { NextRequest, NextResponse } from "next/server";

import { LessonService } from "@/lib/services/lessons";

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
    const count = await LessonService.getNumberOfLessonsByPlayer(id);

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching lessons for player:", error);

    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}
