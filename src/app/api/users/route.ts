import { NextResponse } from "next/server";

import { getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { UserService } from "@/lib/services/users";

export async function GET() {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const allUsers = await UserService.getAllUsersScoped(ctx.facilityId);

    return NextResponse.json(allUsers);
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}
