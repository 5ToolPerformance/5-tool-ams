import { NextRequest, NextResponse } from "next/server";

import {
  createEvaluation,
  type CreateEvaluationInput,
} from "@/application/evaluations/createEvaluation";
import db from "@/db";
import { listBucketsByIds } from "@/db/queries/config/listBucketsByIds";
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

    const body = (await request.json()) as Omit<CreateEvaluationInput, "createdBy"> & {
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

    const evaluation = await createEvaluation(db, {
      ...body,
      evaluationDate,
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
