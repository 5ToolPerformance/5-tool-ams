import { NextRequest, NextResponse } from "next/server";

import { env } from "@/env/server";
import { ArmCareService } from "@/lib/services/external-systems/armcare/armcare-service";

export async function GET(request: NextRequest) {
  if (request.headers.get("Authorization") !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const armcare = new ArmCareService();
    const result = await armcare.sync("cron");
    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("ArmCare sync error:", error);
    return NextResponse.json(
      {
        error: "Failed to sync external armcare data",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
      }
    );
  }
}
