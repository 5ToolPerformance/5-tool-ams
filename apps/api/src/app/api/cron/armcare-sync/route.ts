import { NextRequest, NextResponse } from "next/server";

import { syncArmCare } from "@ams/application/external-systems/armcare/armcare-service";
import { env } from "@/env/server";

export async function GET(request: NextRequest) {
  if (request.headers.get("Authorization") !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncArmCare("cron");
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
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
      }
    );
  }
}
