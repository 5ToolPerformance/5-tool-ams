import { normalizePlayersForDirectory } from "@/domain/player/directory";

describe("normalizePlayersForDirectory", () => {
  it("falls back to legacy primary position when structured positions are missing", () => {
    const result = normalizePlayersForDirectory({
      baseRows: [
        {
          id: "p-1",
          firstName: "Sam",
          lastName: "Taylor",
          dateOfBirth: "2010-04-01",
          throws: "right",
          hits: "left",
          prospect: false,
          sport: "baseball",
          primaryCoachId: "coach-1",
          createdAt: "2026-02-20T00:00:00.000Z",
          legacyPosition: "OF",
        },
      ],
      positionRows: [],
      injurySummaryRows: [],
    });

    expect(result[0]?.primaryPosition).toEqual({
      id: null,
      code: "OF",
      name: "OF",
    });
    expect(result[0]?.secondaryPositions).toEqual([]);
  });

  it("resolves injury status precedence as limited over active", () => {
    const result = normalizePlayersForDirectory({
      baseRows: [
        {
          id: "p-1",
          firstName: "Sam",
          lastName: "Taylor",
          dateOfBirth: "2010-04-01",
          throws: "right",
          hits: "left",
          prospect: false,
          sport: "baseball",
          primaryCoachId: "coach-1",
          createdAt: "2026-02-20T00:00:00.000Z",
          legacyPosition: null,
        },
      ],
      positionRows: [
        {
          playerId: "p-1",
          positionId: "pos-1",
          code: "P",
          name: "Pitcher",
          isPrimary: true,
        },
      ],
      injurySummaryRows: [
        {
          playerId: "p-1",
          hasActive: true,
          hasLimited: true,
          activeCount: 2,
        },
      ],
    });

    expect(result[0]?.injuryStatus).toBe("limited");
    expect(result[0]?.injuryActiveCount).toBe(2);
  });
});

