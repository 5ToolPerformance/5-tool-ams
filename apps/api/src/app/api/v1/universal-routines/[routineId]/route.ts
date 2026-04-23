import { NextRequest, NextResponse } from "next/server";

import { updateUniversalRoutine } from "@ams/application/routines/updateUniversalRoutine";
import db from "@ams/db";
import { getUniversalRoutineById } from "@ams/db/queries/routines/getUniversalRoutineById";
import {
  assertCanEditUniversalRoutine,
  getAuthContext,
  requireRole,
} from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";
import { DomainError, NotFoundError } from "@ams/domain/errors";

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

export async function DELETE(
  _request: NextRequest,
  { params }: UpdateUniversalRoutineRouteProps
) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["admin"]);

    const { routineId } = await params;
    await assertCanEditUniversalRoutine(ctx, routineId);

    const existingRoutine = await getUniversalRoutineById(db, routineId);
    const routine = await updateUniversalRoutine(db, routineId, {
      title: existingRoutine.title,
      description: existingRoutine.description,
      routineType: existingRoutine.routineType,
      disciplineId: existingRoutine.disciplineId,
      sortOrder: existingRoutine.sortOrder,
      isActive: false,
      documentData:
        existingRoutine.documentData && typeof existingRoutine.documentData === "object"
          ? (existingRoutine.documentData as Record<string, unknown>)
          : null,
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

    console.error("Error in DELETE /api/universal-routines/[routineId]:", error);
    return NextResponse.json(
      { error: "Failed to hide universal routine." },
      { status: 500 }
    );
  }
}
