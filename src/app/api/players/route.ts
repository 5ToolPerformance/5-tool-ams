import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import options from "@/config/auth";
import { PlayerService } from "@/lib/services/players";

export async function GET() {
  const session = await getServerSession(options);

  if (!session || !["coach", "admin"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const allPlayers = await PlayerService.getAllPlayersWithInformation();

  return NextResponse.json({
    success: true,
    data: allPlayers,
  });
}
