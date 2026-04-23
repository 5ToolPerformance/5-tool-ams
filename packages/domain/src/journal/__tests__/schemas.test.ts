import { createThrowingJournalEntrySchema } from "@/domain/journal/schemas";

describe("journal schemas", () => {
  it("accepts zero-based soreness and fatigue slider values for throwing entries", () => {
    const result = createThrowingJournalEntrySchema.safeParse({
      playerId: "11111111-1111-1111-1111-111111111111",
      entryType: "throwing",
      entryDate: "2026-04-07",
      contextType: "practice",
      title: null,
      summaryNote: null,
      overallFeel: 4,
      confidenceScore: 4,
      sessionNote: null,
      workloadSegments: [
        {
          throwType: "bullpen",
          throwCount: 25,
          pitchCount: null,
          intentLevel: "high",
          velocityAvg: null,
          velocityMax: null,
          pitchType: null,
          durationMinutes: null,
          notes: null,
          isEstimated: false,
        },
      ],
      armCheckin: {
        armSoreness: 0,
        bodyFatigue: 0,
        armFatigue: 5,
        recoveryScore: 4,
        feelsOff: false,
        statusNote: null,
      },
    });

    expect(result.success).toBe(true);
    if (!result.success) {
      throw new Error(JSON.stringify(result.error.flatten()));
    }
    expect(result.data.armCheckin).toMatchObject({
      armSoreness: 0,
      bodyFatigue: 0,
      armFatigue: 5,
    });
  });

  it("rejects soreness and fatigue values outside the zero-to-five range", () => {
    const result = createThrowingJournalEntrySchema.safeParse({
      playerId: "11111111-1111-1111-1111-111111111111",
      entryType: "throwing",
      entryDate: "2026-04-07",
      contextType: "practice",
      title: null,
      summaryNote: null,
      overallFeel: 4,
      confidenceScore: 4,
      sessionNote: null,
      workloadSegments: [
        {
          throwType: "bullpen",
          throwCount: 25,
          pitchCount: null,
          intentLevel: "high",
          velocityAvg: null,
          velocityMax: null,
          pitchType: null,
          durationMinutes: null,
          notes: null,
          isEstimated: false,
        },
      ],
      armCheckin: {
        armSoreness: -1,
        bodyFatigue: 6,
        armFatigue: 2,
        recoveryScore: 4,
        feelsOff: false,
        statusNote: null,
      },
    });

    expect(result.success).toBe(false);
  });
});
