import { NextRequest, NextResponse } from "next/server";

import { lessonRepository } from "@/lib/services/repository/lessons";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get("playerId");
    const lessonCount = parseInt(searchParams.get("lessonCount") || "1");

    if (!playerId) {
      return NextResponse.json({
        success: false,
        error: "playerId is required",
      });
    }

    const data = await lessonRepository.getLessonReportByPlayerId(
      playerId,
      lessonCount
    );

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error in GET /api/reports/retrieve-data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
