import { NextRequest, NextResponse } from "next/server";

import { armcareExamsRepository } from "@/lib/services/repository/armcare-exams";
import { RouteParams } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: RouteParams<{ id: string }>
) {
  const { id } = await params;

  try {
    const armscore = await armcareExamsRepository.getLatestPlayerArmScore(id);

    if (!armscore) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "No armscore found for player",
      });
    }

    return NextResponse.json({
      success: true,
      data: armscore,
      message: "ArmScore Fetched Successfully",
    });
  } catch (error) {
    console.error("Error fetching lessons for player:", error);

    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}
