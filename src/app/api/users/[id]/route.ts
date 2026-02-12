import { NextRequest, NextResponse } from "next/server";

import { getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
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

    // Get lessons for the player
    const user = await UserService.getUserByIdScoped(id, ctx.facilityId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Error fetching user by id:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user",
      },
      { status: 500 }
    );
  }
}
