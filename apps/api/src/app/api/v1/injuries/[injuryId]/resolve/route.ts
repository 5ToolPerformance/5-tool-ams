import { NextResponse } from "next/server";

import { resolveInjuryUseCase } from "@ams/application/injuries/resolveInjury";
import db from "@ams/db";
import {
  assertCanAccessInjury,
  getAuthContext,
  requireRole,
} from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ injuryId: string }> }
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const { injuryId } = await params;
    await assertCanAccessInjury(ctx, injuryId);
    const [injury] = await resolveInjuryUseCase(db, injuryId);

    if (!injury) {
      return NextResponse.json({ error: "Injury not found" }, { status: 404 });
    }

    return NextResponse.json(injury);
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ error: "Failed to resolve injury" }, { status: 500 });
  }
}
