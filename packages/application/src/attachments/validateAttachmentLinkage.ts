import { eq } from "drizzle-orm";

import type { DB } from "@ams/db";
import {
  evaluations,
  lessonPlayers,
  playerInformation,
} from "@ams/db/schema";
import { DomainError } from "@ams/domain/errors";

type ValidateAttachmentLinkageParams = {
  athleteId: string;
  facilityId: string;
  lessonPlayerId?: string | null;
  evaluationId?: string | null;
};

function assertSameAttachmentOwner(
  target: "lessonPlayerId" | "evaluationId",
  expected: { athleteId: string; facilityId: string },
  actual: { playerId: string | null; facilityId: string | null } | undefined
) {
  if (!actual) {
    throw new DomainError(`Invalid ${target} for attachment.`);
  }

  if (
    actual.playerId !== expected.athleteId ||
    actual.facilityId !== expected.facilityId
  ) {
    throw new DomainError(
      "Attachment link must match the same player and facility."
    );
  }
}

export async function validateAttachmentLinkage(
  db: DB,
  {
    athleteId,
    facilityId,
    lessonPlayerId,
    evaluationId,
  }: ValidateAttachmentLinkageParams
) {
  const expected = { athleteId, facilityId };

  if (lessonPlayerId) {
    const [lessonPlayer] = await db
      .select({
        playerId: lessonPlayers.playerId,
        facilityId: playerInformation.facilityId,
      })
      .from(lessonPlayers)
      .innerJoin(
        playerInformation,
        eq(playerInformation.id, lessonPlayers.playerId)
      )
      .where(eq(lessonPlayers.id, lessonPlayerId))
      .limit(1);

    assertSameAttachmentOwner("lessonPlayerId", expected, lessonPlayer);
  }

  if (evaluationId) {
    const [evaluation] = await db
      .select({
        playerId: evaluations.playerId,
        facilityId: playerInformation.facilityId,
      })
      .from(evaluations)
      .innerJoin(
        playerInformation,
        eq(playerInformation.id, evaluations.playerId)
      )
      .where(eq(evaluations.id, evaluationId))
      .limit(1);

    assertSameAttachmentOwner("evaluationId", expected, evaluation);
  }
}
