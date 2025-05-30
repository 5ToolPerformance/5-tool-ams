import { NextRequest, NextResponse } from "next/server";

import { UserService } from "@/lib/services/users";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate player ID
    if (!id) {
      return NextResponse.json(
        { error: "Player ID is required" },
        { status: 400 }
      );
    }

    // Get lessons for the player
    const coach = await UserService.getUserById(id);

    return NextResponse.json({ coach });
  } catch (error) {
    console.error("Error fetching player by id:", error);

    return NextResponse.json(
      { error: "Failed to fetch player" },
      { status: 500 }
    );
  }
}
