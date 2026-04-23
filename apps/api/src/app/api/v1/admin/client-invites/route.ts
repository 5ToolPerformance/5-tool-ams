import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import {
  createClientInvite,
  getPortalInvitePlayerNames,
  listClientInvites,
} from "@ams/application/client-portal/service";
import { getAuthContext, requireRole } from "@/application/auth/auth-context";
import { toAuthErrorResponse } from "@/application/auth/http";
import { sendClientInviteEmail } from "@ams/application/client-portal/email";
import { createClientInviteToken } from "@ams/application/client-portal/tokens";

const createInviteSchema = z.object({
  email: z.string().email(),
  firstName: z.string().trim().max(100).optional().nullable(),
  lastName: z.string().trim().max(100).optional().nullable(),
  relationshipType: z.enum(["parent", "guardian", "self", "other"]),
  playerIds: z.array(z.string().uuid()).min(1),
});

export async function GET() {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["admin"]);

    const invites = await listClientInvites(ctx.facilityId);

    return NextResponse.json({
      success: true,
      data: invites,
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    return NextResponse.json(
      { error: "Failed to load client invites" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["admin"]);

    const body = await request.json();
    const parsed = createInviteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { token, tokenHash } = createClientInviteToken();
    const invite = await createClientInvite({
      facilityId: ctx.facilityId,
      createdBy: ctx.userId,
      email: parsed.data.email,
      firstName: parsed.data.firstName ?? null,
      lastName: parsed.data.lastName ?? null,
      relationshipType: parsed.data.relationshipType,
      playerIds: parsed.data.playerIds,
      tokenHash,
    });

    const playerNames = await getPortalInvitePlayerNames(parsed.data.playerIds);

    await sendClientInviteEmail({
      email: parsed.data.email.toLowerCase(),
      inviteToken: token,
      recipientName: parsed.data.firstName ?? null,
      playerNames,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: invite.id,
        expiresAt: invite.expiresAt,
      },
    });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create client invite",
      },
      { status: 500 }
    );
  }
}

