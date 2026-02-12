import { NextRequest, NextResponse } from "next/server";

import { assertPlayerAccess, getAuthContext } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { LessonService } from "@/lib/services/lessons";
import { RouteParams } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: RouteParams<{ id: string }>
) {
  try {
    const ctx = await getAuthContext();
    const { id } = await params;

    // Validate player ID
    if (!id) {
      return NextResponse.json(
        { error: "Player ID is required" },
        { status: 400 }
      );
    }

    await assertPlayerAccess(ctx, id);
    // Get lessons for the player
    const count = await LessonService.getNumberOfLessonsByPlayer(id);

    return NextResponse.json({ count });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Error fetching lessons for player:", error);

    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}
