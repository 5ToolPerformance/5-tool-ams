import { NextRequest, NextResponse } from "next/server";

import { getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { ArmCareService } from "@/lib/services/external-systems/armcare/armcare-service";

export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["admin"]);

    const { system } = await request.json();

    let result;

    switch (system) {
      case "armcare":
        const armcare = new ArmCareService();
        result = await armcare.sync("manual");
        break;
      default:
        return NextResponse.json(
          {
            error: "Invalid system",
            details: "Invalid system parameter",
            timestamp: new Date().toISOString(),
          },
          {
            status: 400,
          }
        );
    }
    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Sync error:", error);
    return NextResponse.json(
      {
        error: "Failed to sync external data",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
      }
    );
  }
}
