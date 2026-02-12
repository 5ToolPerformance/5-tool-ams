import { NextRequest, NextResponse } from "next/server";

import { getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { coachRepository } from "@/lib/services/repository/coaches";
import { UserService } from "@/lib/services/users";
import { RouteParams } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: RouteParams<{ id: string }>
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const { id } = await params;

    // Validate player ID
    if (!id) {
      return NextResponse.json(
        { error: "Player ID is required" },
        { status: 400 }
      );
    }

    if (ctx.role === "coach" && id !== ctx.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const coach = await UserService.getUserByIdScoped(id, ctx.facilityId);
    if (!coach || coach.role !== "coach") {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    }

    // Get lessons for the player
    const counts = await coachRepository.findCoachPlayerLessonCounts(id);

    return NextResponse.json({ counts });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Error fetching lesson counts for coach:", error);

    return NextResponse.json(
      { error: "Failed to fetch lesson counts" },
      { status: 500 }
    );
  }
}
