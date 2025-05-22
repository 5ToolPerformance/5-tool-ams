import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import options from "@/config/auth";
// your custom auth config
import { createLessonNote } from "@/lib/db/notes";

export async function POST(req: NextRequest) {
  const session = await getServerSession(options);
  if (
    !session?.user?.id ||
    !["coach", "admin"].includes(session.user.role ?? "")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId, lessonDate, notesText } = await req.json();

  if (!userId || !lessonDate) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const result = await createLessonNote({
    userId,
    coachId: session.user.id,
    lessonDate: new Date(lessonDate),
    notesText,
  });

  return NextResponse.json(result);
}
