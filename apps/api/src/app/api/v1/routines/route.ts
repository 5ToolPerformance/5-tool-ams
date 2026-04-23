import { NextRequest, NextResponse } from "next/server";

import { createRoutine } from "@ams/application/routines/createRoutine";
import db from "@ams/db";
import { getDevelopmentPlanById } from "@ams/db/queries/development-plans/getDevelopmentPlanById";
import type { CreateRoutineRowInput } from "@ams/db/queries/routines/createRoutine";
import {
  assertPlayerAccess,
  getAuthContext,
  requireRole,
} from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";
import { DomainError, NotFoundError } from "@ams/domain/errors";

export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const body = (await request.json()) as Omit<CreateRoutineRowInput, "createdBy">;
    await assertPlayerAccess(ctx, body.playerId);

    if (body.developmentPlanId) {
      const plan = await getDevelopmentPlanById(db, body.developmentPlanId);

      if (plan.playerId !== body.playerId || plan.disciplineId !== body.disciplineId) {
        throw new DomainError(
          "Development plan must belong to the same player and discipline as the routine."
        );
      }
    }

    const routine = await createRoutine(db, {
      ...body,
      createdBy: ctx.userId,
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

    console.error("Error in POST /api/routines:", error);
    return NextResponse.json({ error: "Failed to create routine." }, { status: 500 });
  }
}
