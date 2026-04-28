import { NextRequest, NextResponse } from "next/server";

import { getAuthContext, requireRole } from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";
import { syncArmCare } from "@/application/external-systems/armcare/armcare-service";

export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["admin"]);

    const { system } = await request.json();

    let result;

    switch (system) {
      case "armcare":
        result = await syncArmCare("manual");
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
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
      }
    );
  }
}
