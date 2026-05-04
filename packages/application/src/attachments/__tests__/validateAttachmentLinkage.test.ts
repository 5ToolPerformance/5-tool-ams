import type { DB } from "@ams/db";
import { DomainError } from "@ams/domain/errors";

import { validateAttachmentLinkage } from "../validateAttachmentLinkage";

function createDbMock(
  rows: Array<Array<{ playerId: string | null; facilityId: string | null }>>
) {
  const select = jest.fn(() => {
    const query = {
      from: jest.fn(() => query),
      innerJoin: jest.fn(() => query),
      where: jest.fn(() => query),
      limit: jest.fn(async () => rows.shift() ?? []),
    };

    return query;
  });

  return { select } as unknown as DB;
}

describe("validateAttachmentLinkage", () => {
  it("allows lesson and evaluation links for the same player and facility", async () => {
    const db = createDbMock([
      [{ playerId: "player-1", facilityId: "facility-1" }],
      [{ playerId: "player-1", facilityId: "facility-1" }],
    ]);

    await expect(
      validateAttachmentLinkage(db, {
        athleteId: "player-1",
        facilityId: "facility-1",
        lessonPlayerId: "lesson-player-1",
        evaluationId: "evaluation-1",
      })
    ).resolves.toBeUndefined();
  });

  it("rejects a lesson player link for another player", async () => {
    const db = createDbMock([
      [{ playerId: "player-2", facilityId: "facility-1" }],
    ]);

    await expect(
      validateAttachmentLinkage(db, {
        athleteId: "player-1",
        facilityId: "facility-1",
        lessonPlayerId: "lesson-player-1",
      })
    ).rejects.toThrow(DomainError);
  });

  it("rejects an evaluation link for another facility", async () => {
    const db = createDbMock([
      [{ playerId: "player-1", facilityId: "facility-2" }],
    ]);

    await expect(
      validateAttachmentLinkage(db, {
        athleteId: "player-1",
        facilityId: "facility-1",
        evaluationId: "evaluation-1",
      })
    ).rejects.toThrow(DomainError);
  });
});
