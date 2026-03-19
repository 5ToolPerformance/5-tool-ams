import { getDevelopmentReportData } from "@/application/players/development/getDevelopmentReportData";
import { getActiveDevelopmentPlanForPlayerDiscipline } from "@/db/queries/development-plans/getActiveDevelopmentPlanForPlayerDiscipline";
import { getEvaluationById } from "@/db/queries/evaluations/getEvaluationById";
import { getDisciplinesByIds } from "@/db/queries/players/getDisciplinesByIds";
import { getPlayerHeader } from "@/db/queries/players/PlayerHeader";
import { getRoutinesForDevelopmentPlan } from "@/db/queries/routines/getRoutinesForDevelopmentPlan";

jest.mock("@/db", () => ({
  __esModule: true,
  default: {},
}));

jest.mock(
  "@/db/queries/development-plans/getActiveDevelopmentPlanForPlayerDiscipline",
  () => ({
    getActiveDevelopmentPlanForPlayerDiscipline: jest.fn(),
  })
);

jest.mock("@/db/queries/evaluations/getEvaluationById", () => ({
  getEvaluationById: jest.fn(),
}));

jest.mock("@/db/queries/players/getDisciplinesByIds", () => ({
  getDisciplinesByIds: jest.fn(),
}));

jest.mock("@/db/queries/players/PlayerHeader", () => ({
  getPlayerHeader: jest.fn(),
}));

jest.mock("@/db/queries/routines/getRoutinesForDevelopmentPlan", () => ({
  getRoutinesForDevelopmentPlan: jest.fn(),
}));

describe("getDevelopmentReportData", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (getPlayerHeader as jest.Mock).mockResolvedValue({
      id: "player-1",
      firstName: "Ava",
      lastName: "Stone",
      age: 15,
      positions: [{ name: "Pitcher" }, { name: "Outfield" }],
      handedness: { bat: "right", throw: "left" },
      primaryCoachName: "Coach Lane",
    });
    (getDisciplinesByIds as jest.Mock).mockResolvedValue([
      { id: "disc-1", key: "pitching", label: "Pitching" },
    ]);
    (getActiveDevelopmentPlanForPlayerDiscipline as jest.Mock).mockResolvedValue({
      id: "plan-1",
      playerId: "player-1",
      disciplineId: "disc-1",
      evaluationId: "eval-1",
      status: "active",
      startDate: new Date("2026-01-01"),
      targetEndDate: new Date("2026-03-01"),
      documentData: {
        summary: "Build repeatable direction to the plate.",
        currentPriority: "Stabilize front side",
        shortTermGoals: [{ title: "Improve landing control" }],
        measurableIndicators: [{ title: "Strike rate", metricType: "percentage" }],
      },
    });
    (getEvaluationById as jest.Mock).mockResolvedValue({
      id: "eval-1",
      playerId: "player-1",
      disciplineId: "disc-1",
      evaluationDate: new Date("2026-01-02"),
      evaluationType: "monthly",
      phase: "preseason",
      snapshotSummary: "Command is trending up.",
      strengthProfileSummary: "Strong lower-half stability.",
      keyConstraintsSummary: "Needs consistent lead-leg bracing.",
      documentData: {
        snapshot: { notes: "Internal coach note should never surface." },
        strengthProfile: {
          strengths: ["Lower-half stability"],
          notes: "Coach-only strength note",
        },
        constraints: {
          constraints: ["Lead-leg timing"],
          notes: "Private constraint note",
        },
        focusAreas: [
          {
            title: "Direction",
            description: "Carry momentum through the target line.",
          },
        ],
        evidence: [
          {
            performanceSessionId: "session-1",
            notes: "Bullpen video review",
          },
        ],
      },
    });
    (getRoutinesForDevelopmentPlan as jest.Mock).mockResolvedValue([
      {
        id: "routine-1",
        title: "Direction Reset",
        description: "Simple movement pattern reset.",
        routineType: "partial_lesson",
        documentData: {
          overview: {
            summary: "Reset direction and timing.",
            usageNotes: "Use before mound work.",
          },
          mechanics: [{ title: "Lead-leg direction" }],
          blocks: [
            {
              id: "block-1",
              title: "Mirror work",
              drills: [{ drillId: "drill-1", title: "Wall drill" }],
            },
          ],
        },
      },
      {
        id: "routine-2",
        title: "Unused routine",
        description: null,
        routineType: "full_lesson",
        documentData: null,
      },
    ]);
  });

  it("returns active-plan report data with linked evaluation and filtered routines", async () => {
    const result = await getDevelopmentReportData({
      playerId: "player-1",
      disciplineId: "disc-1",
      includeEvidence: true,
      routineIds: ["routine-1"],
    });

    expect(result?.player.name).toBe("Ava Stone");
    expect(result?.player.age).toBe(15);
    expect(result?.player.positions).toEqual(["Pitcher", "Outfield"]);
    expect(result?.player.handedness).toEqual({ bat: "right", throw: "left" });
    expect(result?.discipline.label).toBe("Pitching");
    expect(result?.evaluation.id).toBe("eval-1");
    expect(result?.routines.map((routine) => routine.id)).toEqual(["routine-1"]);
    expect(result?.evaluation.evidence).toEqual([
      {
        performanceSessionId: "session-1",
        notes: "Bullpen video review",
      },
    ]);
  });

  it("omits evidence when includeEvidence is false", async () => {
    const result = await getDevelopmentReportData({
      playerId: "player-1",
      disciplineId: "disc-1",
      includeEvidence: false,
      routineIds: ["routine-1"],
    });

    expect(result?.evaluation.evidence).toEqual([]);
  });

  it("returns no routines when no routine ids are selected", async () => {
    const result = await getDevelopmentReportData({
      playerId: "player-1",
      disciplineId: "disc-1",
      includeEvidence: false,
      routineIds: [],
    });

    expect(result?.routines).toEqual([]);
  });

  it("excludes evaluation coach-note fields from the report DTO", async () => {
    const result = await getDevelopmentReportData({
      playerId: "player-1",
      disciplineId: "disc-1",
      includeEvidence: false,
      routineIds: [],
    });

    expect(result).toBeTruthy();
    expect(JSON.stringify(result)).not.toContain("Internal coach note should never surface.");
    expect(JSON.stringify(result)).not.toContain("Coach-only strength note");
    expect(JSON.stringify(result)).not.toContain("Private constraint note");
  });

  it("returns null when the active plan exists but the linked evaluation is missing", async () => {
    (getEvaluationById as jest.Mock).mockRejectedValue(new Error("missing"));

    const result = await getDevelopmentReportData({
      playerId: "player-1",
      disciplineId: "disc-1",
      includeEvidence: false,
      routineIds: [],
    });

    expect(result).toBeNull();
  });
});
