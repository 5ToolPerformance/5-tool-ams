import { NextRequest, NextResponse } from "next/server";

import { generateWeeklyUsageReports } from "@/application/admin/weeklyUsageReport/generateWeeklyUsageReports";
import { env } from "@/env/server";

export async function GET(request: NextRequest) {
  if (request.headers.get("Authorization") !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await generateWeeklyUsageReports();

    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Weekly usage report cron error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate weekly usage reports",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
