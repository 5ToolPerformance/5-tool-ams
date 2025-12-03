import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { ArmCareService } from "@/lib/services/external-systems/armcare/armcare-service";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return NextResponse.json(
      {
        error: "Unauthorized",
        details: "User is not authorized to perform this action",
        timestamp: new Date().toISOString(),
      },
      {
        status: 401,
      }
    );
  }

  const { system } = await request.json();

  try {
    let result;

    switch (system) {
      case "armcare":
        const armcare = new ArmCareService();
        result = await armcare.sync();
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
