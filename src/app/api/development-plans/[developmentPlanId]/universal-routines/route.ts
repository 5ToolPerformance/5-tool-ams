import { NextRequest, NextResponse } from "next/server";

import { assignUniversalRoutineToDevelopmentPlan } from "@/application/routines/assignUniversalRoutineToDevelopmentPlan";
import db from "@/db";
import { getDevelopmentPlanById } from "@/db/queries/development-plans/getDevelopmentPlanById";
import { getUniversalRoutineById } from "@/db/queries/routines/getUniversalRoutineById";
import {
  assertFacilityAccess,
  assertPlayerAccess,
  getAuthContext,
  requireRole,
} from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { DomainError, NotFoundError } from "@/lib/errors";

interface AssignUniversalRoutineRouteProps {
  params: Promise<{ developmentPlanId: string }>;
}

export async function POST(
  request: NextRequest,
  { params }: AssignUniversalRoutineRouteProps
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const { developmentPlanId } = await params;
    const body = (await request.json()) as { universalRoutineId?: string };

    if (!body.universalRoutineId) {
      throw new DomainError("universalRoutineId is required.");
    }

    const [plan, universalRoutine] = await Promise.all([
      getDevelopmentPlanById(db, developmentPlanId),
      getUniversalRoutineById(db, body.universalRoutineId),
    ]);

    await assertPlayerAccess(ctx, plan.playerId);
    assertFacilityAccess(ctx, universalRoutine.facilityId);

    const routine = await assignUniversalRoutineToDevelopmentPlan(db, {
      developmentPlanId,
      universalRoutineId: body.universalRoutineId,
      assignedBy: ctx.userId,
    });

    return NextResponse.json(routine, { status: 201 });
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
      "Error in POST /api/development-plans/[developmentPlanId]/universal-routines:",
      error
    );
    return NextResponse.json(
      { error: "Failed to assign universal routine." },
      { status: 500 }
    );
  }
}
