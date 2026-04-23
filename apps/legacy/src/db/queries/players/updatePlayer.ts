import { eq } from "drizzle-orm";

import db from "@/db";
import {
  playerInformation,
  playerMeasurements,
  playerPositions,
} from "@/db/schema";
import { PlayerUpsertInput } from "@/domain/player/types";

export async function updatePlayer(
  playerId: string,
  input: Partial<PlayerUpsertInput>
) {
  return await db.transaction(async (tx) => {
    /* ---------- load current ---------- */
    const current = await tx.query.playerInformation.findFirst({
      where: (p, { eq }) => eq(p.id, playerId),
    });

    if (!current) {
      throw new Error("Player not found");
    }

    /* ---------- core update payload ---------- */
    const updatePayload: Record<string, unknown> = {};

    if (input.firstName !== undefined)
      updatePayload.firstName = input.firstName;
    if (input.lastName !== undefined) updatePayload.lastName = input.lastName;
    if (input.date_of_birth !== undefined)
      updatePayload.date_of_birth = input.date_of_birth;
    if (input.sport !== undefined) updatePayload.sport = input.sport;
    if (input.throws !== undefined) updatePayload.throws = input.throws;
    if (input.hits !== undefined) updatePayload.hits = input.hits;
    if (input.primaryCoachId !== undefined)
      updatePayload.primaryCoachId = input.primaryCoachId;

    /* ---------- measurements ---------- */
    const heightChanged =
      input.height !== undefined && input.height !== current.height;
    const weightChanged =
      input.weight !== undefined && input.weight !== current.weight;

    if (heightChanged || weightChanged) {
      await tx.insert(playerMeasurements).values({
        playerId,
        height: input.height ?? current.height,
        weight: input.weight ?? current.weight,
      });

      updatePayload.height = input.height ?? current.height;
      updatePayload.weight = input.weight ?? current.weight;
    }

    /* ---------- apply core update ---------- */
    if (Object.keys(updatePayload).length > 0) {
      await tx
        .update(playerInformation)
        .set(updatePayload)
        .where(eq(playerInformation.id, playerId));
    }

    /* ---------- positions (optional but atomic) ---------- */
    const hasPositionUpdate =
      input.primaryPositionId !== undefined ||
      input.secondaryPositionIds !== undefined;

    if (hasPositionUpdate) {
      const primaryPositionId = input.primaryPositionId;

      if (!primaryPositionId) {
        throw new Error("Primary position is required when updating positions");
      }

      const primary = await tx.query.positions.findFirst({
        where: (p, { eq }) => eq(p.id, primaryPositionId),
      });

      if (!primary) {
        throw new Error("Primary position not found");
      }

      await tx
        .delete(playerPositions)
        .where(eq(playerPositions.playerId, playerId));

      await tx.insert(playerPositions).values({
        playerId,
        positionId: primaryPositionId,
        isPrimary: true,
      });

      const secondary = Array.from(
        new Set(
          (input.secondaryPositionIds ?? []).filter(
            (id) => id !== primaryPositionId
          )
        )
      );

      if (secondary.length > 0) {
        await tx.insert(playerPositions).values(
          secondary.map((positionId) => ({
            playerId,
            positionId,
            isPrimary: false,
          }))
        );
      }

      // legacy shadow
      await tx
        .update(playerInformation)
        .set({ position: primary.code })
        .where(eq(playerInformation.id, playerId));
    }

    return true;
  });
}
