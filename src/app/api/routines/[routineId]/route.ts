import { NextRequest, NextResponse } from "next/server";

import { updateRoutine } from "@/application/routines/updateRoutines";
import db from "@/db";
import { getDevelopmentPlanById } from "@/db/queries/development-plans/getDevelopmentPlanById";
import { getRoutineById } from "@/db/queries/routines/getRoutineById";
import type { UpdateRoutineRowInput } from "@/db/queries/routines/updateRoutine";
import {
  assertPlayerAccess,
  getAuthContext,
  requireRole,
} from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { DomainError, NotFoundError } from "@/lib/errors";

interface UpdateRoutineRouteProps {
  params: Promise<{ routineId: string }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: UpdateRoutineRouteProps
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const { routineId } = await params;
    const existingRoutine = await getRoutineById(db, routineId);
    const plan = await getDevelopmentPlanById(db, existingRoutine.developmentPlanId);
    await assertPlayerAccess(ctx, plan.playerId);

    const body = (await request.json()) as UpdateRoutineRowInput;

    const routine = await updateRoutine(db, routineId, {
      ...body,
      developmentPlanId: existingRoutine.developmentPlanId,
      createdBy: ctx.userId,
    });

    return NextResponse.json(routine);
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Error in PATCH /api/routines/[routineId]:", error);
    return NextResponse.json({ error: "Failed to update routine." }, { status: 500 });
  }
}
