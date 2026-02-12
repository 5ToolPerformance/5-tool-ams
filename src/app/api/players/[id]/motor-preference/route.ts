import { NextRequest, NextResponse } from "next/server";

import {
  assertPlayerAccess,
  getAuthContext,
  requireRole,
} from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { PlayerService } from "@/lib/services/players";
import { RouteParams } from "@/types/api";
import { MotorPreferencesForm } from "@/types/assessments";

export async function GET(
  request: NextRequest,
  { params }: RouteParams<{ id: string }>
) {
  try {
    const ctx = await getAuthContext();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Player ID is required" },
        { status: 400 }
      );
    }

    await assertPlayerAccess(ctx, id);

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
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
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
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const body: MotorPreferencesForm = await request.json();
    await assertPlayerAccess(ctx, body.playerId);
    body.coachId = ctx.userId;
    const motorPreference = await PlayerService.createMotorPreferences(body);

    return NextResponse.json({
      success: true,
      data: motorPreference,
      message: "Motor Preferences Created Successfully",
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
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
