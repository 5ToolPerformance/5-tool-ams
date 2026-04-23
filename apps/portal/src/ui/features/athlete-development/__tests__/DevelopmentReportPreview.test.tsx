import { render, screen } from "@testing-library/react";

import { DevelopmentReportPreview } from "@/ui/features/athlete-development/DevelopmentReportPreview";

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
  generatedOn: new Date("2026-03-19"),
  evaluation: {
    id: "eval-1",
    date: new Date("2026-03-01"),
    type: "monthly",
    phase: "preseason",
    snapshotSummary: "Command is trending up.",
    strengthProfileSummary: "Lower-half stability is a strength.",
    keyConstraintsSummary: "Lead-leg timing needs consistency.",
    strengths: ["Lower-half stability"],
    focusAreas: [
      {
        title: "Direction",
        description: "Carry momentum down the mound line.",
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
    shortTermGoals: [
      {
        title: "Own landing position",
        description: "Repeat the same landing window.",
      },
    ],
    longTermGoals: [
      {
        title: "Sustain command under fatigue",
        description: null,
      },
    ],
    focusAreas: [],
    measurableIndicators: [
      {
        title: "Strike rate",
        description: "Track bullpen strike percentage.",
        metricType: "percentage",
      },
    ],
  },
  routines: [],
};

describe("DevelopmentReportPreview", () => {
  it("renders parent-facing report sections and omits evidence when not provided", () => {
    render(<DevelopmentReportPreview data={baseData} />);

    expect(screen.getByTestId("development-report-document")).toBeTruthy();
    expect(screen.getByText("Player Development Report")).toBeTruthy();
    expect(screen.getByText("Age")).toBeTruthy();
    expect(screen.getByText("15")).toBeTruthy();
    expect(screen.getByText("Pitcher, Outfield")).toBeTruthy();
    expect(screen.getByText("R/L")).toBeTruthy();
    expect(screen.getByText("Evaluation Overview")).toBeTruthy();
    expect(screen.getByText("Development Plan")).toBeTruthy();
    expect(screen.queryByText("Evaluation Evidence")).toBeNull();
  });

  it("orders evaluation content as snapshot, strength summary, strengths, constraint summary, constraints, then focus areas", () => {
    render(<DevelopmentReportPreview data={baseData} />);

    const snapshotHeading = screen.getByText("Current Snapshot");
    const strengthSummaryHeading = screen.getByText("Strength Summary");
    const strengthsHeading = screen.getByText("Strengths");
    const constraintSummaryHeading = screen.getByText("Constraint Summary");
    const constraintsHeading = screen.getByText("Constraints");
    const focusAreasHeading = screen.getByText("Focus Areas");

    const order = [
      snapshotHeading,
      strengthSummaryHeading,
      strengthsHeading,
      constraintSummaryHeading,
      constraintsHeading,
      focusAreasHeading,
    ].map((node) => node.compareDocumentPosition(snapshotHeading));

    expect(snapshotHeading.compareDocumentPosition(strengthSummaryHeading)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(strengthSummaryHeading.compareDocumentPosition(strengthsHeading)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(
      strengthsHeading.compareDocumentPosition(constraintSummaryHeading)
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(
      constraintSummaryHeading.compareDocumentPosition(constraintsHeading)
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(constraintsHeading.compareDocumentPosition(focusAreasHeading)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(order.length).toBe(6);
  });

  it("renders selected routines and evidence when provided", () => {
    render(
      <DevelopmentReportPreview
        data={{
          ...baseData,
          evaluation: {
            ...baseData.evaluation,
            evidence: [
              {
                performanceSessionId: "session-1",
                notes: "Bullpen video review",
              },
            ],
          },
          routines: [
            {
              id: "routine-1",
              title: "Direction Reset",
              description: "Movement reset before mound work.",
              routineType: "partial_lesson",
              summary: "Reset direction and timing.",
              usageNotes: "Use before bullpens.",
              mechanics: ["Lead-leg direction"],
              blocks: [
                {
                  id: "block-1",
                  title: "Mirror work",
                  notes: null,
                  drills: [
                    {
                      drillId: "drill-1",
                      title: "Wall drill",
                      notes: "3 slow reps",
                    },
                  ],
                },
              ],
            },
          ],
        }}
      />
    );

    expect(screen.getByText("Evaluation Evidence")).toBeTruthy();
    expect(screen.getByText("Selected Routines")).toBeTruthy();
    expect(screen.getByText("Direction Reset")).toBeTruthy();
    expect(screen.getByText("Wall drill")).toBeTruthy();
  });

  it("never renders evaluation coach notes because they are not part of the report DTO", () => {
    render(<DevelopmentReportPreview data={baseData} />);

    expect(screen.queryByText(/coach note/i)).toBeNull();
    expect(screen.queryByText(/internal/i)).toBeNull();
    expect(screen.queryByText(/New Evaluation/i)).toBeNull();
    expect(screen.queryByText(/Active Plan/i)).toBeNull();
    expect(screen.queryByText(/^Back$/i)).toBeNull();
  });
});
