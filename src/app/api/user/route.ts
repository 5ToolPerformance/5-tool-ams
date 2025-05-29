import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import options from "@/config/auth";
import { UserService } from "@/lib/services/users";

export async function GET() {
  const session = await getServerSession(options);

  if (!session || !["coach", "admin"].includes(session.user.role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const allUsers = await UserService.getAllUsers();

  return NextResponse.json(allUsers);
}
