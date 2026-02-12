import { NextRequest, NextResponse } from "next/server";

import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";

import db from "@/db";
import {
  allowedUsers,
  playerAccountLinkAudit,
  playerInformation,
  users,
} from "@/db/schema";
import {
  getAuthContext,
  requireRole,
} from "@/lib/auth/auth-context";
import { toAuthErrorResponse } from "@/lib/auth/http";
import { DEFAULT_ORGANIZATION_ID } from "@/lib/constants";

const schema = z.object({
  playerId: z.string().uuid(),
  email: z.string().email(),
  provider: z.literal("google"),
});

export async function POST(request: NextRequest) {
  try {
    const ctx = await getAuthContext();
    requireRole(ctx, ["admin"]);

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const playerId = parsed.data.playerId;
    const email = parsed.data.email.toLowerCase();
    const provider = parsed.data.provider;

    const result = await db.transaction(async (tx) => {
      const [targetPlayer] = await tx
        .select({
          id: playerInformation.id,
          userId: playerInformation.userId,
          facilityId: playerInformation.facilityId,
        })
        .from(playerInformation)
        .where(eq(playerInformation.id, playerId))
        .limit(1);

      if (!targetPlayer || targetPlayer.facilityId !== ctx.facilityId) {
        return {
          error: "Player not found",
          status: 404,
        } as const;
      }

      await tx
        .insert(allowedUsers)
        .values({
          email,
          provider,
          role: "player",
          status: "active",
          organizationId: DEFAULT_ORGANIZATION_ID,
        })
        .onConflictDoUpdate({
          target: [
            allowedUsers.organizationId,
            allowedUsers.provider,
            allowedUsers.email,
          ],
          set: {
            role: "player",
            status: "active",
            updatedAt: new Date(),
          },
        });

      const [existingUser] = await tx
        .select({
          id: users.id,
        })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      let userId = existingUser?.id;
      if (userId) {
        await tx
          .update(users)
          .set({
            role: "player",
            facilityId: ctx.facilityId,
            isActive: true,
          })
          .where(eq(users.id, userId));
      } else {
        const [createdUser] = await tx
          .insert(users)
          .values({
            email,
            role: "player",
            facilityId: ctx.facilityId,
            isActive: true,
          })
          .returning({ id: users.id });
        userId = createdUser.id;
      }

      const otherPlayers = await tx
        .select({
          id: playerInformation.id,
        })
        .from(playerInformation)
        .where(
          and(
            eq(playerInformation.userId, userId),
            ne(playerInformation.id, targetPlayer.id)
          )
        );

      for (const otherPlayer of otherPlayers) {
        await tx
          .update(playerInformation)
          .set({ userId: null })
          .where(eq(playerInformation.id, otherPlayer.id));

        await tx.insert(playerAccountLinkAudit).values({
          playerId: otherPlayer.id,
          previousUserId: userId,
          nextUserId: null,
          linkedEmail: email,
          provider,
          actionByAdminId: ctx.userId,
          action: "unlinked_existing_user",
        });
      }

      const previousUserId = targetPlayer.userId ?? null;
      await tx
        .update(playerInformation)
        .set({ userId })
        .where(eq(playerInformation.id, targetPlayer.id));

      const action = previousUserId && previousUserId !== userId
        ? "reassigned"
        : "linked";

      await tx.insert(playerAccountLinkAudit).values({
        playerId: targetPlayer.id,
        previousUserId,
        nextUserId: userId,
        linkedEmail: email,
        provider,
        actionByAdminId: ctx.userId,
        action,
      });

      return {
        data: {
          playerId: targetPlayer.id,
          userId,
          email,
          action,
        },
      } as const;
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    const authResponse = toAuthErrorResponse(error);
    if (authResponse) return authResponse;

    console.error("POST /api/admin/player-account-links error:", error);
    return NextResponse.json(
      { error: "Failed to link player account" },
      { status: 500 }
    );
  }
}
