import { NextRequest, NextResponse } from "next/server";

import { PlayerService } from "@/lib/services/players";
import { MotorPreferencesForm } from "@/types/assessments";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Player ID is required" },
        { status: 400 }
      );
    }

    const motorPref = await PlayerService.getMotorPreferencesById(id);

    if (!motorPref) {
      return NextResponse.json(
        {
          success: false,
          error: "Motor Preferences Not Found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: motorPref,
      message: "Motor Preferences Fetched Successfully",
    });
  } catch (error) {
    console.error("Error in GET /api/player/[id]/motor-preference:", error);
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
    const body: MotorPreferencesForm = await request.json();
    const motorPreference = await PlayerService.createMotorPreferences(body);

    return NextResponse.json({
      success: true,
      data: motorPreference,
      message: "Motor Preferences Created Successfully",
    });
  } catch (error) {
    console.error("Error in POST /api/player/[id]/motor-preference:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
