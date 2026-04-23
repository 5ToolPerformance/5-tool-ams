import {
  buildThrowingDailySummarySnapshot,
  computeThrowingWorkloadUnits,
  getWorkloadQuality,
  hasBullpenExposure,
  hasGameExposure,
  hasHighIntentExposure,
} from "@/domain/journal/throwing";

describe("journal throwing helpers", () => {
  const segments = [
    {
      throwType: "bullpen" as const,
      throwCount: 30,
      pitchCount: 25,
      intentLevel: "high" as const,
      velocityAvg: 84,
      velocityMax: 87,
      pitchType: null,
      durationMinutes: null,
      notes: null,
      isEstimated: false,
    },
    {
      throwType: "game" as const,
      throwCount: 15,
      pitchCount: 15,
      intentLevel: "max" as const,
      velocityAvg: null,
      velocityMax: 91,
      pitchType: null,
      durationMinutes: null,
      notes: null,
      isEstimated: false,
    },
  ];

  it("computes workload units with velocity-aware weighting", () => {
    expect(computeThrowingWorkloadUnits(segments)).toBe(82.13);
    expect(getWorkloadQuality(segments)).toBe("mixed");
  });

  it("detects exposure flags", () => {
    expect(hasBullpenExposure(segments)).toBe(true);
    expect(hasGameExposure(segments)).toBe(true);
    expect(hasHighIntentExposure(segments)).toBe(true);
  });

  it("builds a daily snapshot from segment and arm-checkin inputs", () => {
    expect(
      buildThrowingDailySummarySnapshot({
        playerId: "player-1",
        summaryDate: "2026-04-02",
        entryCount: 2,
        segments,
        armCheckins: [
          null,
          {
            armSoreness: 2,
            bodyFatigue: 3,
            armFatigue: 4,
            recoveryScore: 4,
            feelsOff: false,
            statusNote: null,
          },
        ],
      })
    ).toMatchObject({
      playerId: "player-1",
      summaryDate: "2026-04-02",
      totalThrowCount: 45,
      totalPitchCount: 40,
      entryCount: 2,
      sorenessScore: 2,
      fatigueScore: 4,
      hasBullpen: true,
      hasGameExposure: true,
      hasHighIntentExposure: true,
    });
  });
});
