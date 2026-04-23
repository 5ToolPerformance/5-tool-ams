import { eq } from "drizzle-orm";

import db from "@/db";
import {
  playerInformation,
  playerMeasurements,
  playerPositions,
} from "@/db/schema";
import { PlayerUpsertInput } from "@/domain/player/types";

export async function createPlayer(input: PlayerUpsertInput) {
  return await db.transaction(async (tx) => {
    /* ---------- primary position (required) ---------- */
    const primary = await tx.query.positions.findFirst({
      where: (p, { eq }) => eq(p.id, input.primaryPositionId),
    });

    if (!primary) {
      throw new Error("Primary position is required");
    }

    /* ---------- create player ---------- */
    const [created] = await tx
      .insert(playerInformation)
      .values({
        userId: null, // players not yet linked to accounts
        firstName: input.firstName,
        lastName: input.lastName,
        date_of_birth: input.date_of_birth,
        sport: input.sport,
        height: input.height ?? 0, // legacy constraint
        weight: input.weight ?? 0,
        throws: input.throws ?? "right",
        hits: input.hits ?? "right",
        primaryCoachId: input.primaryCoachId,
        facilityId: input.facilityId ?? null,
        position: primary.code, // legacy shadow column
      })
      .returning();

    /* ---------- measurement snapshot ---------- */
    if (input.height !== null && input.weight !== null) {
      await tx.insert(playerMeasurements).values({
        playerId: created.id,
        height: input.height,
        weight: input.weight,
      });
    }

    /* ---------- positions (authoritative) ---------- */
    // wipe existing (probably none on create, but safe)
    await tx
      .delete(playerPositions)
      .where(eq(playerPositions.playerId, created.id));

    // primary
    await tx.insert(playerPositions).values({
      playerId: created.id,
      positionId: input.primaryPositionId,
      isPrimary: true,
    });

    // secondary
    const secondary = Array.from(
      new Set(
        input.secondaryPositionIds.filter(
          (id) => id !== input.primaryPositionId
        )
      )
    );

    if (secondary.length > 0) {
      await tx.insert(playerPositions).values(
        secondary.map((positionId) => ({
          playerId: created.id,
          positionId,
          isPrimary: false,
        }))
      );
    }

    return created;
  });
}
