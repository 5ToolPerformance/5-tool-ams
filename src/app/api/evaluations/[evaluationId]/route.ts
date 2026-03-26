import { NextRequest, NextResponse } from "next/server";

import { getEvaluationDetail } from "@/application/players/development/getDevelopmentDocumentDetails";
import {
  updateEvaluation,
  type UpdateEvaluationInput,
} from "@/application/evaluations/updateEvaluation";
import db from "@/db";
import { listBucketsByIds } from "@/db/queries/config/listBucketsByIds";
import {
  assertPlayerAccess,
  getAuthContext,
  requireRole,
} from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { DomainError, NotFoundError } from "@/lib/errors";

interface UpdateEvaluationRouteProps {
  params: Promise<{ evaluationId: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: UpdateEvaluationRouteProps
) {
  try {
    const ctx = await getAuthContext();
    const { evaluationId } = await params;
    const evaluation = await getEvaluationDetail(evaluationId);

    await assertPlayerAccess(ctx, evaluation.playerId);

    return NextResponse.json(evaluation);
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.error("Error in GET /api/evaluations/[evaluationId]:", error);

    return NextResponse.json(
      { error: "Failed to load evaluation." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: UpdateEvaluationRouteProps
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const { evaluationId } = await params;
    const body = (await request.json()) as UpdateEvaluationInput & {
      playerId: string;
      createdBy?: string;
      evaluationDate: string | Date;
      documentData?: {
        buckets?: Array<{ bucketId: string }>;
      } | null;
    };

    const evaluationDate =
      body.evaluationDate instanceof Date
        ? body.evaluationDate
        : new Date(body.evaluationDate);

    if (Number.isNaN(evaluationDate.getTime())) {
      return NextResponse.json(
        { error: "Evaluation date is invalid." },
        { status: 400 }
      );
    }

    await assertPlayerAccess(ctx, body.playerId);

    const bucketIds =
      body.documentData?.buckets?.map((bucket) => bucket.bucketId) ?? [];

    if (bucketIds.length > 0) {
      const matchingBuckets = await listBucketsByIds(
        bucketIds,
        body.disciplineId,
        db
      );

      if (matchingBuckets.length !== new Set(bucketIds).size) {
        return NextResponse.json(
          { error: "One or more buckets do not belong to the selected discipline." },
          { status: 400 }
        );
      }
    }

    const evaluation = await updateEvaluation(db, evaluationId, {
      ...body,
      evaluationDate,
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
