import { NextResponse } from "next/server";

import { generateWeeklyUsageReportForFacility } from "@/application/admin/weeklyUsageReport/generateWeeklyUsageReports";
import { getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";

export async function POST() {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["admin"]);

    const result = await generateWeeklyUsageReportForFacility(ctx.facilityId, {
      generatedByUserId: ctx.userId,
    });

    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    console.error("POST /api/admin/weekly-usage-reports error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate weekly usage report",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
