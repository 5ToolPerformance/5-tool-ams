import {
  buildHittingSummaryText,
  getAtBatCount,
  getOutcomeCounts,
  getPlateAppearanceCount,
  normalizeAtBats,
} from "@/domain/journal/hitting";

describe("journal hitting helpers", () => {
  const atBats = [
    {
      atBatNumber: 3,
      outcome: "walk" as const,
      resultCategory: null,
      pitchTypeSeen: null,
      pitchLocation: null,
      countAtResult: null,
      runnersInScoringPosition: null,
      rbi: null,
      notes: null,
    },
    {
      atBatNumber: 1,
      outcome: "single" as const,
      resultCategory: null,
      pitchTypeSeen: null,
      pitchLocation: null,
      countAtResult: null,
      runnersInScoringPosition: null,
      rbi: 1,
      notes: null,
    },
    {
      atBatNumber: 2,
      outcome: "strikeout" as const,
      resultCategory: null,
      pitchTypeSeen: null,
      pitchLocation: null,
      countAtResult: null,
      runnersInScoringPosition: null,
      rbi: null,
      notes: null,
    },
  ];

  it("normalizes numbering and counts outcomes", () => {
    const normalized = normalizeAtBats(atBats);
    expect(normalized.map((atBat) => atBat.atBatNumber)).toEqual([1, 2, 3]);
    expect(getPlateAppearanceCount(normalized)).toBe(3);
    expect(getAtBatCount(normalized)).toBe(2);
    expect(getOutcomeCounts(normalized)).toEqual({
      single: 1,
      strikeout: 1,
      walk: 1,
    });
  });

  it("builds concise summary text", () => {
    expect(buildHittingSummaryText(normalizeAtBats(atBats))).toBe("1 single, 1 walk");
  });
});
