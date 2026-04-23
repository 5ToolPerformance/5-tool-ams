import { NextRequest, NextResponse } from "next/server";

import { createDevelopmentPlan } from "@ams/application/development-plans/createDevelopmentPlan";
import db from "@ams/db";
import type { CreateDevelopmentPlanRowInput } from "@ams/db/queries/development-plans/createDevelopmentPlan";
import {
  assertPlayerAccess,
  getAuthContext,
  requireRole,
} from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";
import { DomainError, NotFoundError } from "@ams/domain/errors";

function parseOptionalDate(value: string | Date | null | undefined) {
  if (!value) {
    return null;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const body = (await request.json()) as Omit<
      CreateDevelopmentPlanRowInput,
      "createdBy"
    > & {
      createdBy?: string;
      startDate?: string | Date | null;
      targetEndDate?: string | Date | null;
    };

    await assertPlayerAccess(ctx, body.playerId);

    const startDate = parseOptionalDate(body.startDate);
    const targetEndDate = parseOptionalDate(body.targetEndDate);

    if (body.startDate && !startDate) {
      return NextResponse.json(
        { error: "Start date is invalid." },
        { status: 400 }
      );
    }

    if (body.targetEndDate && !targetEndDate) {
      return NextResponse.json(
        { error: "Target end date is invalid." },
        { status: 400 }
      );
    }

    const developmentPlan = await createDevelopmentPlan(db, {
      ...body,
      createdBy: ctx.userId,
      startDate,
      targetEndDate,
    });

    return NextResponse.json(developmentPlan, { status: 201 });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Error in POST /api/development-plans:", error);

    return NextResponse.json(
      { error: "Failed to create development plan." },
      { status: 500 }
    );
  }
}
