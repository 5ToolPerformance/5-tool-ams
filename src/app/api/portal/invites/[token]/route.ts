import { NextResponse } from "next/server";

import { getClientInvitePreviewByToken } from "@/application/client-portal/service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const invite = await getClientInvitePreviewByToken(token);

  if (!invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: invite,
  });
}

