import { NextResponse } from "next/server";

import { getUnlinkedHawkinAthletes } from "@/db/queries/hawkin/getUnlinkedHawkinAthletes";
import { getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";

/**
 * GET /api/admin/hawkin/unlinked-athletes
 *
 * Returns Hawkin athletes that are not yet linked
 * to internal players via external_athlete_ids.
 */
export async function GET() {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["admin"]);

    const athletes = await getUnlinkedHawkinAthletes();

    return NextResponse.json({
      athletes,
      count: athletes.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ error: "Failed to fetch athletes" }, { status: 500 });
  }
}
