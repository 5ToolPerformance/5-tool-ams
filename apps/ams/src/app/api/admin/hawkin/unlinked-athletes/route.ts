import { NextResponse } from "next/server";

import { getAuthContext, requireRole } from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";

export async function GET() {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["admin"]);

    return NextResponse.json(
      {
        error: "Hawkin automatic integration is disabled",
        athletes: [],
        count: 0,
        timestamp: new Date().toISOString(),
      },
      { status: 410 }
    );
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    return NextResponse.json(
      { error: "Failed to check Hawkin integration status" },
      { status: 500 }
    );
  }
}
