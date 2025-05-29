import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import options from "@/config/auth";
import { LessonService } from "@/lib/db/lessons";

export async function GET() {
  const session = await getServerSession(options);

  if (!session || !["coach", "admin"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const allPlayers = await LessonService.getUsers();

  return NextResponse.json({ 
      success: true,
      data: allPlayers 
    });
}
