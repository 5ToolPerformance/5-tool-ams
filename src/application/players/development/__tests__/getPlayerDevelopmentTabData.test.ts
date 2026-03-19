import { getPlayerDevelopmentTabData } from "@/application/players/development/getPlayerDevelopmentTabData";
import { getActiveDevelopmentPlanForPlayerDiscipline } from "@/db/queries/development-plans/getActiveDevelopmentPlanForPlayerDiscipline";
import { getDevelopmentPlansForPlayer } from "@/db/queries/development-plans/getDevelopmentPlansForPlayers";
import { getEvaluationsForPlayer } from "@/db/queries/evaluations/getEvaluationsForPlayer";
import { getDisciplinesByIds } from "@/db/queries/players/getDisciplinesByIds";
import { getRoutinesForDevelopmentPlan } from "@/db/queries/routines/getRoutinesForDevelopmentPlan";

jest.mock("@/db", () => ({
  __esModule: true,
  default: {},
}));

jest.mock("@/db/queries/evaluations/getEvaluationsForPlayer", () => ({
  getEvaluationsForPlayer: jest.fn(),
}));

jest.mock(
  "@/db/queries/development-plans/getDevelopmentPlansForPlayers",
  () => ({
    getDevelopmentPlansForPlayer: jest.fn(),
  })
);

jest.mock(
  "@/db/queries/development-plans/getActiveDevelopmentPlanForPlayerDiscipline",
  () => ({
    getActiveDevelopmentPlanForPlayerDiscipline: jest.fn(),
  })
);

jest.mock("@/db/queries/players/getDisciplinesByIds", () => ({
  getDisciplinesByIds: jest.fn(),
}));

jest.mock("@/db/queries/routines/getRoutinesForDevelopmentPlan", () => ({
  getRoutinesForDevelopmentPlan: jest.fn(),
}));

describe("getPlayerDevelopmentTabData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("defaults to first data-backed discipline and computes latest + history", async () => {
    (getEvaluationsForPlayer as jest.Mock)
      .mockResolvedValueOnce([
        { id: "eval-1", disciplineId: "disc-1", evaluationDate: new Date("2026-01-05") },
      ])
      .mockResolvedValueOnce([
        { id: "eval-2", disciplineId: "disc-1", evaluationDate: new Date("2026-02-05") },
        { id: "eval-1", disciplineId: "disc-1", evaluationDate: new Date("2026-01-05") },
      ]);

    (getDevelopmentPlansForPlayer as jest.Mock)
      .mockResolvedValueOnce([
        { id: "plan-1", disciplineId: "disc-1", status: "active" },
      ])
      .mockResolvedValueOnce([
        { id: "plan-1", disciplineId: "disc-1", status: "active" },
      ]);

    (getDisciplinesByIds as jest.Mock).mockResolvedValue([
      { id: "disc-1", key: "pitching", label: "Pitching" },
    ]);
    (getActiveDevelopmentPlanForPlayerDiscipline as jest.Mock).mockResolvedValue({
      id: "plan-1",
      disciplineId: "disc-1",
      status: "active",
    });
    (getRoutinesForDevelopmentPlan as jest.Mock).mockResolvedValue([
      { id: "routine-1", developmentPlanId: "plan-1" },
    ]);

    const result = await getPlayerDevelopmentTabData("player-1");

    expect(result.selectedDiscipline?.id).toBe("disc-1");
    expect(result.latestEvaluation?.id).toBe("eval-2");
    expect(result.evaluationHistory.map((row) => row.id)).toEqual(["eval-1"]);
    expect(result.flags.hasActivePlan).toBe(true);
    expect(result.flags.hasRoutines).toBe(true);
  });

  it("falls back to first discipline when provided discipline is invalid", async () => {
    (getEvaluationsForPlayer as jest.Mock)
      .mockResolvedValueOnce([{ id: "eval-1", disciplineId: "disc-1" }])
      .mockResolvedValueOnce([{ id: "eval-1", disciplineId: "disc-1" }]);

    (getDevelopmentPlansForPlayer as jest.Mock)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    (getDisciplinesByIds as jest.Mock).mockResolvedValue([
      { id: "disc-1", key: "pitching", label: "Pitching" },
    ]);
    (getActiveDevelopmentPlanForPlayerDiscipline as jest.Mock).mockResolvedValue(null);

    const result = await getPlayerDevelopmentTabData("player-1", "missing-discipline");

    expect(result.selectedDiscipline?.id).toBe("disc-1");
    expect(getEvaluationsForPlayer).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ disciplineId: "disc-1" })
    );
  });

  it("does not query routines when there is no active plan", async () => {
    (getEvaluationsForPlayer as jest.Mock)
      .mockResolvedValueOnce([{ id: "eval-1", disciplineId: "disc-1" }])
      .mockResolvedValueOnce([{ id: "eval-1", disciplineId: "disc-1" }]);
    (getDevelopmentPlansForPlayer as jest.Mock)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    (getDisciplinesByIds as jest.Mock).mockResolvedValue([
      { id: "disc-1", key: "pitching", label: "Pitching" },
    ]);
    (getActiveDevelopmentPlanForPlayerDiscipline as jest.Mock).mockResolvedValue(null);

    await getPlayerDevelopmentTabData("player-1", "disc-1");

    expect(getRoutinesForDevelopmentPlan).not.toHaveBeenCalled();
  });
});
