import { NextRequest, NextResponse } from "next/server";

import { updateEvaluation } from "@/application/evaluations/updateEvaluation";
import db from "@/db";
import type { UpdateEvaluationRowInput } from "@/db/queries/evaluations/updateEvaluation";
import {
  assertPlayerAccess,
  getAuthContext,
  requireRole,
} from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { DomainError } from "@/lib/errors";

interface UpdateEvaluationRouteProps {
  params: Promise<{ evaluationId: string }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: UpdateEvaluationRouteProps
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const { evaluationId } = await params;
    const body = (await request.json()) as UpdateEvaluationRowInput & {
      playerId: string;
      disciplineId: string;
      createdBy?: string;
    };

    await assertPlayerAccess(ctx, body.playerId);

    const evaluation = await updateEvaluation(db, evaluationId, {
      ...body,
      createdBy: ctx.userId,
    });

    return NextResponse.json(evaluation);
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Error in PATCH /api/evaluations/[evaluationId]:", error);

    return NextResponse.json(
      { error: "Failed to update evaluation." },
      { status: 500 }
    );
  }
}
