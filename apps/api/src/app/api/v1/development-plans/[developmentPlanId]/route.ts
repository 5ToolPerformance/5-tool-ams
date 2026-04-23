import { NextRequest, NextResponse } from "next/server";

import { getDevelopmentPlanDetail } from "@ams/application/players/development/getDevelopmentDocumentDetails";
import { getDevelopmentPlanById } from "@ams/db/queries/development-plans/getDevelopmentPlanById";
import { updateDevelopmentPlan } from "@ams/application/development-plans/updateDevelopmentPlan";
import db from "@ams/db";
import type { UpdateDevelopmentPlanRowInput } from "@ams/db/queries/development-plans/updateDevelopmentPlan";
import {
  assertPlayerAccess,
  getAuthContext,
  requireRole,
} from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";
import { DomainError, NotFoundError } from "@ams/domain/errors";

interface UpdateDevelopmentPlanRouteProps {
  params: Promise<{ developmentPlanId: string }>;
}

function parseOptionalDate(value: string | Date | null | undefined) {
  if (!value) {
    return null;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function GET(
  request: NextRequest,
  { params }: UpdateDevelopmentPlanRouteProps
) {
  try {
    const ctx = await getAuthContext();
    const { developmentPlanId } = await params;
    const developmentPlan = await getDevelopmentPlanDetail(developmentPlanId);

    await assertPlayerAccess(ctx, developmentPlan.playerId);

    return NextResponse.json(developmentPlan);
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.error(
      "Error in GET /api/development-plans/[developmentPlanId]:",
      error
    );

    return NextResponse.json(
      { error: "Failed to load development plan." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: UpdateDevelopmentPlanRouteProps
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const { developmentPlanId } = await params;
    const existingPlan = await getDevelopmentPlanById(db, developmentPlanId);
    await assertPlayerAccess(ctx, existingPlan.playerId);

    const body = (await request.json()) as UpdateDevelopmentPlanRowInput & {
      startDate?: string | Date | null;
      targetEndDate?: string | Date | null;
    };

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

    const developmentPlan = await updateDevelopmentPlan(db, developmentPlanId, {
      ...body,
      startDate,
      targetEndDate,
    });

    return NextResponse.json(developmentPlan);
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error(
      "Error in PATCH /api/development-plans/[developmentPlanId]:",
      error
    );

    return NextResponse.json(
      { error: "Failed to update development plan." },
      { status: 500 }
    );
  }
}
