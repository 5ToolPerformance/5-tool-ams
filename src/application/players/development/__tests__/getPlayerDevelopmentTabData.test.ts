import { getPlayerDevelopmentTabData } from "@/application/players/development/getPlayerDevelopmentTabData";
import { listActiveDisciplines } from "@/db/queries/config/listActiveDisciplines";
import { getDevelopmentPlansForPlayer } from "@/db/queries/development-plans/getDevelopmentPlansForPlayers";
import { getEvaluationById } from "@/db/queries/evaluations/getEvaluationById";
import { getEvaluationsForPlayer } from "@/db/queries/evaluations/getEvaluationsForPlayer";
import { getRoutinesForPlayer } from "@/db/queries/routines/getRoutinesForPlayer";
import { listUniversalRoutines } from "@/db/queries/routines/listUniversalRoutines";

jest.mock("@/db", () => ({
  __esModule: true,
  default: {},
}));

jest.mock("@/db/queries/evaluations/getEvaluationsForPlayer", () => ({
  getEvaluationsForPlayer: jest.fn(),
}));

jest.mock("@/db/queries/evaluations/getEvaluationById", () => ({
  getEvaluationById: jest.fn(),
}));

jest.mock(
  "@/db/queries/development-plans/getDevelopmentPlansForPlayers",
  () => ({
    getDevelopmentPlansForPlayer: jest.fn(),
  })
);

jest.mock("@/db/queries/config/listActiveDisciplines", () => ({
  listActiveDisciplines: jest.fn(),
}));

jest.mock("@/db/queries/routines/getRoutinesForPlayer", () => ({
  getRoutinesForPlayer: jest.fn(),
}));

jest.mock("@/db/queries/routines/listUniversalRoutines", () => ({
  listUniversalRoutines: jest.fn(),
}));

describe("getPlayerDevelopmentTabData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (listUniversalRoutines as jest.Mock).mockResolvedValue([]);
  });

  it("defaults to the first data-backed discipline and computes latest evaluation history", async () => {
    (getEvaluationsForPlayer as jest.Mock)
      .mockResolvedValueOnce([
        { id: "eval-1", disciplineId: "disc-1", evaluationDate: new Date("2026-01-05") },
      ])
      .mockResolvedValueOnce([
        { id: "eval-2", disciplineId: "disc-1", evaluationDate: new Date("2026-02-05") },
        { id: "eval-1", disciplineId: "disc-1", evaluationDate: new Date("2026-01-05") },
      ]);

    (getDevelopmentPlansForPlayer as jest.Mock).mockResolvedValue([
      {
        id: "plan-1",
        disciplineId: "disc-1",
        evaluationId: "eval-2",
        status: "active",
        startDate: new Date("2026-03-01"),
        targetEndDate: new Date("2026-04-01"),
        createdOn: new Date("2026-02-01"),
      },
    ]);

    (listActiveDisciplines as jest.Mock).mockResolvedValue([
      { id: "disc-1", key: "pitching", label: "Pitching" },
    ]);

    (getEvaluationById as jest.Mock).mockResolvedValue({
      id: "eval-2",
      playerId: "player-1",
      disciplineId: "disc-1",
    });

    (getRoutinesForPlayer as jest.Mock).mockResolvedValue([
      {
        id: "routine-1",
        playerId: "player-1",
        disciplineId: "disc-1",
        disciplineKey: "pitching",
        disciplineLabel: "Pitching",
      },
    ]);

    const result = await getPlayerDevelopmentTabData(
      "player-1",
      undefined,
      "facility-1"
    );

    expect(result.selectedDiscipline?.id).toBe("disc-1");
    expect(result.latestEvaluation?.id).toBe("eval-2");
    expect(result.evaluationHistory.map((row) => row.id)).toEqual(["eval-1"]);
    expect(result.activePlan?.id).toBe("plan-1");
    expect(result.developmentPlanHistory).toEqual([]);
    expect(result.flags.hasActivePlan).toBe(true);
    expect(result.flags.hasRoutines).toBe(true);
    expect(result.report).toEqual({
      linkedEvaluationId: "eval-2",
      canGenerate: true,
    });
    expect(result.universalRoutinesSupported).toBe(true);
    expect(listUniversalRoutines).toHaveBeenCalledWith({
      facilityId: "facility-1",
      disciplineId: "disc-1",
    });
  });

  it("falls back to the first visible discipline when the requested discipline is invalid", async () => {
    (getEvaluationsForPlayer as jest.Mock)
      .mockResolvedValueOnce([{ id: "eval-1", disciplineId: "disc-1" }])
      .mockResolvedValueOnce([{ id: "eval-1", disciplineId: "disc-1" }]);

    (getDevelopmentPlansForPlayer as jest.Mock).mockResolvedValue([]);

    (listActiveDisciplines as jest.Mock).mockResolvedValue([
      { id: "disc-1", key: "pitching", label: "Pitching" },
    ]);

    (getEvaluationById as jest.Mock).mockResolvedValue(null);

    const result = await getPlayerDevelopmentTabData("player-1", "missing-discipline");

    expect(result.selectedDiscipline?.id).toBe("disc-1");
    expect(getEvaluationsForPlayer).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ disciplineId: "disc-1" })
    );
  });

  it("uses an eligible draft plan as the active plan when no eligible active plan exists", async () => {
    (getEvaluationsForPlayer as jest.Mock)
      .mockResolvedValueOnce([{ id: "eval-1", disciplineId: "disc-1" }])
      .mockResolvedValueOnce([{ id: "eval-1", disciplineId: "disc-1" }]);

    (getDevelopmentPlansForPlayer as jest.Mock).mockResolvedValue([
      {
        id: "plan-draft",
        disciplineId: "disc-1",
        evaluationId: "eval-1",
        status: "draft",
        startDate: new Date("2099-03-30"),
        targetEndDate: new Date("2099-04-30"),
        createdOn: new Date("2026-01-15"),
      },
      {
        id: "plan-completed",
        disciplineId: "disc-1",
        evaluationId: "eval-1",
        status: "completed",
        startDate: new Date("2025-01-01"),
        targetEndDate: new Date("2025-02-01"),
        createdOn: new Date("2025-01-01"),
      },
    ]);

    (listActiveDisciplines as jest.Mock).mockResolvedValue([
      { id: "disc-1", key: "pitching", label: "Pitching" },
    ]);

    (getEvaluationById as jest.Mock).mockResolvedValue({ id: "eval-1" });
    (getRoutinesForPlayer as jest.Mock).mockResolvedValue([]);

    const result = await getPlayerDevelopmentTabData("player-1", "disc-1");

    expect(result.activePlan?.id).toBe("plan-draft");
    expect(result.developmentPlanHistory.map((row) => row.id)).toEqual([
      "plan-completed",
    ]);
    expect(result.flags.hasActivePlan).toBe(true);
  });

  it("prefers an eligible active plan over an eligible draft plan", async () => {
    (getEvaluationsForPlayer as jest.Mock)
      .mockResolvedValueOnce([{ id: "eval-1", disciplineId: "disc-1" }])
      .mockResolvedValueOnce([{ id: "eval-1", disciplineId: "disc-1" }]);

    (getDevelopmentPlansForPlayer as jest.Mock).mockResolvedValue([
      {
        id: "plan-draft",
        disciplineId: "disc-1",
        evaluationId: "eval-1",
        status: "draft",
        startDate: new Date("2099-05-01"),
        targetEndDate: new Date("2099-06-01"),
        createdOn: new Date("2026-02-01"),
      },
      {
        id: "plan-active",
        disciplineId: "disc-1",
        evaluationId: "eval-1",
        status: "active",
        startDate: new Date("2026-03-01"),
        targetEndDate: new Date("2026-04-01"),
        createdOn: new Date("2026-01-01"),
      },
    ]);

    (listActiveDisciplines as jest.Mock).mockResolvedValue([
      { id: "disc-1", key: "pitching", label: "Pitching" },
    ]);

    (getEvaluationById as jest.Mock).mockResolvedValue({ id: "eval-1" });
    (getRoutinesForPlayer as jest.Mock).mockResolvedValue([]);

    const result = await getPlayerDevelopmentTabData("player-1", "disc-1");

    expect(result.activePlan?.id).toBe("plan-active");
    expect(result.developmentPlanHistory.map((row) => row.id)).toEqual([
      "plan-draft",
    ]);
  });

  it("still queries player routines when there is no eligible active plan", async () => {
    (getEvaluationsForPlayer as jest.Mock)
      .mockResolvedValueOnce([{ id: "eval-1", disciplineId: "disc-1" }])
      .mockResolvedValueOnce([{ id: "eval-1", disciplineId: "disc-1" }]);

    (getDevelopmentPlansForPlayer as jest.Mock).mockResolvedValue([
      {
        id: "plan-archived",
        disciplineId: "disc-1",
        evaluationId: "eval-1",
        status: "archived",
        startDate: new Date("2025-01-01"),
        targetEndDate: new Date("2025-02-01"),
        createdOn: new Date("2025-01-01"),
      },
      {
        id: "plan-old-draft",
        disciplineId: "disc-1",
        evaluationId: "eval-1",
        status: "draft",
        startDate: new Date("2024-01-01"),
        targetEndDate: new Date("2024-02-01"),
        createdOn: new Date("2024-01-01"),
      },
    ]);

    (listActiveDisciplines as jest.Mock).mockResolvedValue([
      { id: "disc-1", key: "pitching", label: "Pitching" },
    ]);

    await getPlayerDevelopmentTabData("player-1", "disc-1", "facility-1");

    expect(getRoutinesForPlayer).toHaveBeenCalledWith(expect.anything(), {
      playerId: "player-1",
    });
    expect(getEvaluationById).not.toHaveBeenCalled();
  });

  it("disables report generation when the linked evaluation cannot be loaded", async () => {
    (getEvaluationsForPlayer as jest.Mock)
      .mockResolvedValueOnce([{ id: "eval-1", disciplineId: "disc-1" }])
      .mockResolvedValueOnce([{ id: "eval-1", disciplineId: "disc-1" }]);

    (getDevelopmentPlansForPlayer as jest.Mock).mockResolvedValue([
      {
        id: "plan-1",
        disciplineId: "disc-1",
        evaluationId: "missing-eval",
        status: "active",
        startDate: new Date("2026-03-01"),
        targetEndDate: new Date("2026-04-01"),
        createdOn: new Date("2026-01-01"),
      },
    ]);

    (listActiveDisciplines as jest.Mock).mockResolvedValue([
      { id: "disc-1", key: "pitching", label: "Pitching" },
      { id: "disc-2", key: "hitting", label: "Hitting" },
    ]);

    (getEvaluationById as jest.Mock).mockRejectedValue(new Error("missing"));
    (getRoutinesForPlayer as jest.Mock).mockResolvedValue([]);

    const result = await getPlayerDevelopmentTabData("player-1", "disc-2");

    expect(result.disciplineOptions.map((row) => row.id)).toEqual(["disc-1"]);
    expect(result.selectedDiscipline?.id).toBe("disc-1");
    expect(result.report).toEqual({
      linkedEvaluationId: null,
      canGenerate: false,
    });
    expect(result.flags.hasAnyDisciplineData).toBe(true);
    expect(result.flags.hasEvaluations).toBe(true);
  });

  it("returns cross-discipline player routines with discipline metadata for the routines section", async () => {
    (getEvaluationsForPlayer as jest.Mock)
      .mockResolvedValueOnce([{ id: "eval-1", disciplineId: "disc-1" }])
      .mockResolvedValueOnce([{ id: "eval-1", disciplineId: "disc-1" }]);

    (getDevelopmentPlansForPlayer as jest.Mock).mockResolvedValue([]);
    (listActiveDisciplines as jest.Mock).mockResolvedValue([
      { id: "disc-1", key: "pitching", label: "Pitching" },
      { id: "disc-2", key: "hitting", label: "Hitting" },
    ]);
    (getRoutinesForPlayer as jest.Mock).mockResolvedValue([
      {
        id: "routine-1",
        playerId: "player-1",
        disciplineId: "disc-1",
        disciplineKey: "pitching",
        disciplineLabel: "Pitching",
      },
      {
        id: "routine-2",
        playerId: "player-1",
        disciplineId: "disc-2",
        disciplineKey: "hitting",
        disciplineLabel: "Hitting",
      },
    ]);

    const result = await getPlayerDevelopmentTabData("player-1", "disc-1", "facility-1");

    expect(result.playerRoutines.map((routine) => ({
      id: routine.id,
      disciplineId: routine.disciplineId,
      disciplineKey: routine.disciplineKey,
      disciplineLabel: routine.disciplineLabel,
    }))).toEqual([
      {
        id: "routine-1",
        disciplineId: "disc-1",
        disciplineKey: "pitching",
        disciplineLabel: "Pitching",
      },
      {
        id: "routine-2",
        disciplineId: "disc-2",
        disciplineKey: "hitting",
        disciplineLabel: "Hitting",
      },
    ]);
  });
});
