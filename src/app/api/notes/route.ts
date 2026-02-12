import { NextRequest, NextResponse } from "next/server";

import { getAuthContext, requireRole } from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { createLessonNote } from "@/lib/db/notes";

export async function POST(req: NextRequest) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["coach", "admin"]);

    const { userId, lessonDate, notesText } = await req.json();

    if (!userId || !lessonDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await createLessonNote({
      userId,
      coachId: ctx.userId,
      lessonDate: new Date(lessonDate),
      notesText,
    });

    return NextResponse.json(result);
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
