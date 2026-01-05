import { NextResponse } from "next/server";

import { playerRepository } from "@/lib/services/repository/players";

export async function GET() {
  try {
    const players = await playerRepository.findPlayersForLessonForm();
    return NextResponse.json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}
