import { NextRequest, NextResponse } from "next/server";

import { createUniversalRoutine } from "@/application/routines/createUniversalRoutine";
import db from "@/db";
import {
  getAuthContext,
  requireRole,
} from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { DomainError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const body = (await request.json()) as Omit<
      Parameters<typeof createUniversalRoutine>[1],
      "createdBy" | "facilityId"
    >;

    const routine = await createUniversalRoutine(db, {
      ...body,
      createdBy: ctx.userId,
      facilityId: ctx.facilityId,
    });

    return NextResponse.json(routine, { status: 201 });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Error in POST /api/universal-routines:", error);
    return NextResponse.json(
      { error: "Failed to create universal routine." },
      { status: 500 }
    );
  }
}
