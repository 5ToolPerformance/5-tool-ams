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
} from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";
import { DomainError, NotFoundError } from "@/domain/errors";

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
    const legacyPlan =
      !existingRoutine.playerId || !existingRoutine.disciplineId
        ? existingRoutine.developmentPlanId
          ? await getDevelopmentPlanById(db, existingRoutine.developmentPlanId)
          : null
        : null;

    const playerId = existingRoutine.playerId ?? legacyPlan?.playerId;
    const disciplineId = existingRoutine.disciplineId ?? legacyPlan?.disciplineId;

    if (!playerId || !disciplineId) {
      throw new DomainError(
        "Routine ownership is missing. Backfill player and discipline before editing this routine."
      );
    }

    await assertPlayerAccess(ctx, playerId);

    const body = (await request.json()) as UpdateRoutineRowInput;

    const routine = await updateRoutine(db, routineId, {
      ...body,
      playerId,
      disciplineId,
      developmentPlanId: existingRoutine.developmentPlanId ?? undefined,
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
