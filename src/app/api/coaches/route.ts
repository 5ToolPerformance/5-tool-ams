import { NextResponse } from "next/server";

import { getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { UserService } from "@/lib/services/users";

export async function GET() {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const coaches = await UserService.getAllCoachesScoped(ctx.facilityId);

    return NextResponse.json({
      success: true,
      data: coaches,
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Error in GET /api/coaches:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
