import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getUnlinkedHawkinAthletes } from "@/db/queries/hawkin/getUnlinkedHawkinAthletes";

/**
 * GET /api/admin/hawkin/unlinked-athletes
 *
 * Returns Hawkin athletes that are not yet linked
 * to internal players via external_athlete_ids.
 */
export async function GET() {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return NextResponse.json(
      {
        error: "Unauthorized",
        details: "User is not authorized to perform this action",
        timestamp: new Date().toISOString(),
      },
      { status: 401 }
    );
  }

  const athletes = await getUnlinkedHawkinAthletes();

  return NextResponse.json({
    athletes,
    count: athletes.length,
    timestamp: new Date().toISOString(),
  });
}
