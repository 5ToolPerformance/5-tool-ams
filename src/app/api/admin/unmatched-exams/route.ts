// app/api/admin/unmatched-exams/route.ts
import { NextRequest, NextResponse } from "next/server";

import { desc, eq } from "drizzle-orm";
import { getSession } from "next-auth/react";

import { auth } from "@/auth";
import db from "@/db";
import {
  armcareExams,
  armcareExamsUnmatched,
  externalAthleteIds,
} from "@/db/schema";

export async function GET() {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return NextResponse.json(
      {
        error: "Unauthorized",
        details: "User is not authorized to perform this action",
        timestamp: new Date().toISOString(),
      },
      {
        status: 401,
      }
    );
  }

  const unmatched = await db.query.armcareExamsUnmatched.findMany({
    where: eq(armcareExamsUnmatched.status, "pending"),
    orderBy: desc(armcareExamsUnmatched.createdAt),
  });

  return NextResponse.json({ unmatched });
}

// Manually resolve an unmatched exam
export async function POST(request: NextRequest) {
  const session = await getSession();

  if (session?.user.role !== "admin") {
    return NextResponse.json(
      {
        error: "Unauthorized",
        details: "User is not authorized to perform this action",
        timestamp: new Date().toISOString(),
      },
      {
        status: 401,
      }
    );
  }

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
    linkedBy: session.user.id,
    verifiedAt: new Date().toISOString(),
  });

  // Mark as resolved
  await db
    .update(armcareExamsUnmatched)
    .set({
      status: "resolved",
      resolvedAt: new Date().toISOString(),
      resolvedBy: session.user.id,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(armcareExamsUnmatched.id, unmatchedExamId));

  return NextResponse.json({ success: true });
}
