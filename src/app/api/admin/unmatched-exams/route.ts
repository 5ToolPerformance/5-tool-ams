import { NextRequest, NextResponse } from "next/server";

import { desc, eq } from "drizzle-orm";

import db from "@/db";
import {
  armcareExams,
  armcareExamsUnmatched,
  externalAthleteIds,
} from "@/db/schema";
import { getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";

export async function GET() {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["admin"]);

    const unmatched = await db.query.armcareExamsUnmatched.findMany({
      where: eq(armcareExamsUnmatched.status, "pending"),
      orderBy: desc(armcareExamsUnmatched.createdAt),
    });

    return NextResponse.json({
      success: true,
      unmatched,
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ error: "Failed to fetch unmatched exams" }, { status: 500 });
  }
}

// Manually resolve an unmatched exam
export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["admin"]);

    const { unmatchedExamId, playerId } = await request.json();

    const unmatchedExam = await db.query.armcareExamsUnmatched.findFirst({
      where: eq(armcareExamsUnmatched.id, unmatchedExamId),
    });

    if (!unmatchedExam) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Move to main table
    await db.insert(armcareExams).values({
      playerId,
      externalExamId: unmatchedExam.externalExamId,
      examDate: unmatchedExam.examDate,
      examTime: unmatchedExam.examTime,
      examType: unmatchedExam.examType,
      timezone: unmatchedExam.timezone,
      armScore: unmatchedExam.armScore,
      totalStrength: unmatchedExam.totalStrength,
      shoulderBalance: unmatchedExam.shoulderBalance,
      velo: unmatchedExam.velo,
      svr: unmatchedExam.svr,
      totalStrengthPost: unmatchedExam.totalStrengthPost,
      postStrengthLoss: unmatchedExam.postStrengthLoss,
      totalPercentFresh: unmatchedExam.totalPercentFresh,
      rawData: unmatchedExam.rawData,
      syncedAt: new Date().toISOString(),
    });

    // Create mapping
    await db.insert(externalAthleteIds).values({
      playerId,
      externalSystem: "armcare",
      externalId: unmatchedExam.externalPlayerId,
      externalEmail: unmatchedExam.externalEmail,
      linkingMethod: "manual",
      linkingStatus: "active",
      confidence: "1.0",
      linkedBy: ctx.userId,
      verifiedAt: new Date().toISOString(),
    });

    // Mark as resolved
    await db
      .update(armcareExamsUnmatched)
      .set({
        status: "resolved",
        resolvedAt: new Date().toISOString(),
        resolvedBy: ctx.userId,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(armcareExamsUnmatched.id, unmatchedExamId));

    return NextResponse.json({ success: true });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ error: "Failed to resolve unmatched exam" }, { status: 500 });
  }
}
