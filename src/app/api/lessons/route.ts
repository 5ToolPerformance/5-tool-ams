import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import db from "@/db";
import { lesson, playerInformation, users } from "@/db/schema";
import {
  assertPlayerAccess,
  getAuthContext,
  requireRole,
} from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { LessonService } from "@/lib/services/lessons";
import { LessonCreateData } from "@/types/lessons";

export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const body: LessonCreateData = await request.json();
    await assertPlayerAccess(ctx, body.playerId);
    body.coachId = ctx.userId;

    // Validate the request data
    const validationErrors = LessonService.validateLessonData(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    // Create the lesson
    const lesson = await LessonService.createLesson(body);

    return NextResponse.json({
      success: true,
      data: lesson,
      message: "Lesson created successfully",
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Error in POST /api/lessons:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    const { searchParams } = new URL(request.url);
    const coachId = searchParams.get("coachId");
    const playerId = searchParams.get("playerId");

    if (ctx.role === "player") {
      if (!ctx.playerId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const lessons = await db
        .select({
          lesson,
          coach: users,
          player: playerInformation,
        })
        .from(lesson)
        .innerJoin(users, eq(lesson.coachId, users.id))
        .innerJoin(playerInformation, eq(lesson.playerId, playerInformation.id))
        .where(eq(lesson.playerId, ctx.playerId));

      return NextResponse.json({ success: true, data: lessons });
    }

    if (playerId) {
      await assertPlayerAccess(ctx, playerId);
      const lessons = await db
        .select({
          lesson,
          coach: users,
          player: playerInformation,
        })
        .from(lesson)
        .innerJoin(users, eq(lesson.coachId, users.id))
        .innerJoin(playerInformation, eq(lesson.playerId, playerInformation.id))
        .where(
          and(
            eq(lesson.playerId, playerId),
            eq(playerInformation.facilityId, ctx.facilityId)
          )
        );
      return NextResponse.json({
        success: true,
        data: lessons,
      });
    }

    const effectiveCoachId = coachId ?? (ctx.role === "coach" ? ctx.userId : null);

    if (coachId && ctx.role === "coach" && coachId !== ctx.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const whereClause = effectiveCoachId
      ? and(
          eq(playerInformation.facilityId, ctx.facilityId),
          eq(lesson.coachId, effectiveCoachId)
        )
      : eq(playerInformation.facilityId, ctx.facilityId);

    const lessons = await db
      .select({
        lesson,
        coach: users,
        player: playerInformation,
      })
      .from(lesson)
      .innerJoin(users, eq(lesson.coachId, users.id))
      .innerJoin(playerInformation, eq(lesson.playerId, playerInformation.id))
      .where(whereClause);

    return NextResponse.json({
      success: true,
      data: lessons,
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    console.error("Error in GET /api/lessons:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
