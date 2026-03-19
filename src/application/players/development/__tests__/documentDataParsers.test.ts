import {
  parseDevelopmentPlanSummary,
  parseEvaluationSummary,
  parseRoutineSummary,
} from "@/application/players/development/documentDataParsers";

describe("documentDataParsers", () => {
  it("returns safe defaults for malformed values", () => {
    expect(parseEvaluationSummary("bad-value")).toEqual({
      phaseNote: null,
      focusAreaTitles: [],
      constraints: [],
    });
    expect(parseDevelopmentPlanSummary(null)).toEqual({
      summary: null,
      currentPriority: null,
      shortTermGoalTitles: [],
      longTermGoalTitles: [],
    });
    expect(parseRoutineSummary(undefined)).toEqual({
      summary: null,
      mechanicPreview: [],
      blockCount: 0,
    });
  });

  it("derives concise summaries from supported document shapes", () => {
    expect(
      parseEvaluationSummary({
        snapshot: { notes: "Maintaining command in bullpen work." },
        focusAreas: [{ title: "Lead-leg stability" }],
        constraints: { constraints: ["Limited hip IR"] },
      })
    ).toEqual({
      phaseNote: "Maintaining command in bullpen work.",
      focusAreaTitles: ["Lead-leg stability"],
      constraints: ["Limited hip IR"],
    });

    expect(
      parseDevelopmentPlanSummary({
        summary: "Build rotational power in preseason block.",
        currentPriority: "Increase med-ball output quality",
        shortTermGoals: [{ title: "Hip-shoulder separation" }],
        longTermGoals: [{ title: "Sustained velocity through outing" }],
      })
    ).toEqual({
      summary: "Build rotational power in preseason block.",
      currentPriority: "Increase med-ball output quality",
      shortTermGoalTitles: ["Hip-shoulder separation"],
      longTermGoalTitles: ["Sustained velocity through outing"],
    });

    expect(
      parseRoutineSummary({
        overview: { summary: "Weekly mechanical reset sequence." },
        mechanics: [{ title: "Front-side timing" }],
        blocks: [{ id: "b1" }, { id: "b2" }],
      })
    ).toEqual({
      summary: "Weekly mechanical reset sequence.",
      mechanicPreview: ["Front-side timing"],
      blockCount: 2,
    });
  });
});
