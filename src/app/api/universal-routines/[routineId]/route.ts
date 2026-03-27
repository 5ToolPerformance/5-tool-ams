import { NextRequest, NextResponse } from "next/server";

import { updateUniversalRoutine } from "@/application/routines/updateUniversalRoutine";
import db from "@/db";
import { getUniversalRoutineById } from "@/db/queries/routines/getUniversalRoutineById";
import {
  assertCanEditUniversalRoutine,
  getAuthContext,
  requireRole,
} from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { DomainError, NotFoundError } from "@/lib/errors";

interface UpdateUniversalRoutineRouteProps {
  params: Promise<{ routineId: string }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: UpdateUniversalRoutineRouteProps
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const { routineId } = await params;
    await assertCanEditUniversalRoutine(ctx, routineId);

    const existingRoutine = await getUniversalRoutineById(db, routineId);
    const body = (await request.json()) as Omit<
      Parameters<typeof updateUniversalRoutine>[2],
      "createdBy"
    >;

    const routine = await updateUniversalRoutine(db, routineId, {
      ...body,
      disciplineId: body.disciplineId ?? existingRoutine.disciplineId,
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

    console.error("Error in PATCH /api/universal-routines/[routineId]:", error);
    return NextResponse.json(
      { error: "Failed to update universal routine." },
      { status: 500 }
    );
  }
}
