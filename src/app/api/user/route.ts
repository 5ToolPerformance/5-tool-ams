import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import options from "@/config/auth";
import { getAllUsers } from "@/lib/db/users";

export async function GET() {
  const session = await getServerSession(options);

  if (!session || !["coach", "admin"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const allUsers = await getAllUsers();

  return NextResponse.json(allUsers);
}
