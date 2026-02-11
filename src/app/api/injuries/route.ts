import { NextResponse } from "next/server";

import { logInjury } from "@/application/injuries/logInjury";
import { auth } from "@/auth";
import db from "@/db";

export async function POST(req: Request) {
  const body = await req.json();
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const injury = await logInjury(db, body, {
    reportedByUserId: session.user.id,
    reportedByRole: "coach", // "coach" | "trainer" | etc
  });

  return NextResponse.json(injury, { status: 201 });
}
