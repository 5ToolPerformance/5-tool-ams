import { getDevelopmentReportPdfHtml } from "@/lib/reports/developmentReportPdf";

const baseData = {
  player: {
    id: "player-1",
    name: "Ava Stone",
    age: 15,
    positions: ["Pitcher", "Outfield"],
    handedness: {
      bat: "right",
      throw: "left",
    },
    primaryCoachName: "Coach Lane",
  },
  discipline: {
    id: "disc-1",
    key: "pitching",
    label: "Pitching",
  },
  generatedOn: new Date("2026-03-20"),
  evaluation: {
    id: "eval-1",
    date: new Date("2026-03-01"),
    type: "monthly",
    phase: "preseason",
    snapshotSummary: "Snapshot summary",
    strengthProfileSummary: "Strength summary",
    keyConstraintsSummary: "Constraint summary",
    strengths: ["Lower-half stability", "Arm timing"],
    focusAreas: [
      {
        title: "Direction",
        description: "Carry momentum through the target line.",
      },
    ],
    constraints: ["Lead-leg timing"],
    evidence: [],
  },
  plan: {
    id: "plan-1",
    status: "active",
    startDate: new Date("2026-03-02"),
    targetEndDate: new Date("2026-05-01"),
    summary: "Build a more repeatable delivery.",
    currentPriority: "Stabilize the front side",
    shortTermGoals: [],
    longTermGoals: [],
    focusAreas: [],
    measurableIndicators: [],
  },
  routines: [],
};

describe("getDevelopmentReportPdfHtml", () => {
  it("renders the watermark markup and navy accent palette", () => {
    const html = getDevelopmentReportPdfHtml(baseData, {
      logoDataUri: "data:image/svg+xml;base64,ZmFrZQ==",
    });

    expect(html).toContain("development-report-watermark");
    expect(html).toContain('src="data:image/svg+xml;base64,ZmFrZQ=="');
    expect(html).toContain("#294a7f");
    expect(html).toContain("#15315a");
    expect(html).toContain("#d9e5f8");
    expect(html).not.toContain("#f5c84c");
    expect(html).not.toContain("#facc15");
  });

  it("preserves the evaluation section order in the rendered document", () => {
    const html = getDevelopmentReportPdfHtml(baseData, {
      logoDataUri: "data:image/svg+xml;base64,ZmFrZQ==",
    });

    const snapshotIndex = html.indexOf("Current Snapshot");
    const strengthSummaryIndex = html.indexOf("Strength Summary");
    const strengthsIndex = html.indexOf(">Strengths<");
    const constraintSummaryIndex = html.indexOf("Constraint Summary");
    const constraintsIndex = html.indexOf(">Constraints<");
    const focusAreasIndex = html.indexOf(">Focus Areas<");

    expect(snapshotIndex).toBeGreaterThan(-1);
    expect(strengthSummaryIndex).toBeGreaterThan(snapshotIndex);
    expect(strengthsIndex).toBeGreaterThan(strengthSummaryIndex);
    expect(constraintSummaryIndex).toBeGreaterThan(strengthsIndex);
    expect(constraintsIndex).toBeGreaterThan(constraintSummaryIndex);
    expect(focusAreasIndex).toBeGreaterThan(constraintsIndex);
  });
});
