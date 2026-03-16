import { NextRequest, NextResponse } from "next/server";

import { createEvaluation } from "@/application/evaluations/createEvaluation";
import db from "@/db";
import type { CreateEvaluationRowInput } from "@/db/queries/evaluations/createEvaluation";
import {
  assertPlayerAccess,
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
      CreateEvaluationRowInput,
      "createdBy"
    > & {
      createdBy?: string;
    };

    await assertPlayerAccess(ctx, body.playerId);

    const evaluation = await createEvaluation(db, {
      ...body,
      createdBy: ctx.userId,
    });

    return NextResponse.json(evaluation, { status: 201 });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Error in POST /api/evaluations:", error);

    return NextResponse.json(
      { error: "Failed to create evaluation." },
      { status: 500 }
    );
  }
}
