import { NextRequest, NextResponse } from "next/server";

import { PlayerService } from "@/lib/services/players";
import { MotorPreferencesForm } from "@/types/assessments";

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
