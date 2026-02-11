import { NextResponse } from "next/server";

import { resolveInjuryUseCase } from "@/application/injuries/resolveInjury";
import { auth } from "@/auth";
import db from "@/db";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ injuryId: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { injuryId } = await params;
  const [injury] = await resolveInjuryUseCase(db, injuryId);

  if (!injury) {
    return NextResponse.json({ error: "Injury not found" }, { status: 404 });
  }

  return NextResponse.json(injury);
}
