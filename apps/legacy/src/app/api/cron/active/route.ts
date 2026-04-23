import { NextRequest, NextResponse } from "next/server";

import { env } from "@/env/server";

export async function GET(req: NextRequest) {
  if (req.headers.get("Authorization") !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log("Cron test successful at:", new Date().toISOString());
  return Response.json({
    ok: true,
    timestamp: new Date().toISOString(),
    message: "Cron job test successful",
  });
}
