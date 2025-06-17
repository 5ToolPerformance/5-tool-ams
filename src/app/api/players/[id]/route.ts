import { NextRequest, NextResponse } from "next/server";

import { UserService } from "@/lib/services/users";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    // Validate player ID
    if (!id) {
      return NextResponse.json(
        { error: "Player ID is required" },
        { status: 400 }
      );
    }

    // Get lessons for the player
    const player = await UserService.getUserById(id);

    return NextResponse.json({ player });
  } catch (error) {
    console.error("Error fetching player by id:", error);

    return NextResponse.json(
      { error: "Failed to fetch player" },
      { status: 500 }
    );
  }
}
