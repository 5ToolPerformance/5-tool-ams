import { act, renderHook, waitFor } from "@testing-library/react";

import { useRoutineForm } from "@/ui/features/development/forms/routines/useRoutineForm";

const originalFetch = global.fetch;

const developmentPlanOptions = [
  {
    id: "plan-1",
    playerId: "player-1",
    disciplineId: "disc-1",
    disciplineKey: "pitching",
    disciplineLabel: "Pitching",
    status: "active" as const,
    title: "Active plan",
  },
];

const mechanicOptions = [
  {
    id: "mech-1",
    name: "Front-side timing",
    description: null,
    type: "pitching" as const,
    tags: [],
  },
];

const drillOptions = [
  {
    id: "drill-1",
    title: "Stride timing drill",
    description: "desc",
    discipline: "pitching" as const,
    tags: [],
  },
  {
    id: "drill-2",
    title: "Balance drill",
    description: "desc",
    discipline: "pitching" as const,
    tags: [],
  },
];

describe("useRoutineForm", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("allows saving without a development plan selection", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: "routine-1" }),
    });

    const { result } = renderHook(() =>
      useRoutineForm({
        mode: "create",
        contextType: "development-plan",
        createdBy: "coach-1",
        developmentPlanOptions,
        initialPlayerId: "player-1",
        initialDisciplineId: "disc-1",
        disciplineOptions: [{ id: "disc-1", key: "pitching", label: "Pitching" }],
        mechanicOptions,
        drillOptions,
      })
    );

    act(() => {
      result.current.setFieldValue("title", "Routine");
      result.current.addMechanic();
      result.current.updateMechanic(0, {
        mechanicId: "mech-1",
        title: "Front-side timing",
      });
      result.current.addBlock();
      result.current.updateBlock(0, { title: "Block 1" });
      result.current.addDrillsToBlock(0, ["drill-1"]);
    });

    await act(async () => {
      await result.current.handleSubmit("save");
    });

    expect(result.current.errors.developmentPlanId).toBeUndefined();
    expect(global.fetch).toHaveBeenCalled();
  });

  it("requires discipline when no development plan is selected", async () => {
    const { result } = renderHook(() =>
      useRoutineForm({
        mode: "create",
        contextType: "development-plan",
        createdBy: "coach-1",
        initialPlayerId: "player-1",
        developmentPlanOptions,
        disciplineOptions: [{ id: "disc-1", key: "pitching", label: "Pitching" }],
        mechanicOptions,
        drillOptions,
      })
    );

    act(() => {
      result.current.setFieldValue("title", "Routine");
      result.current.addMechanic();
      result.current.updateMechanic(0, {
        mechanicId: "mech-1",
        title: "Front-side timing",
      });
      result.current.addBlock();
      result.current.updateBlock(0, { title: "Block 1" });
      result.current.addDrillsToBlock(0, ["drill-1"]);
    });

    await act(async () => {
      await result.current.handleSubmit("save");
    });

    expect(result.current.errors.disciplineId).toBe("Discipline is required.");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("inherits discipline from the selected development plan", () => {
    const { result } = renderHook(() =>
      useRoutineForm({
        mode: "create",
        contextType: "development-plan",
        createdBy: "coach-1",
        initialPlayerId: "player-1",
        developmentPlanOptions,
        disciplineOptions: [
          { id: "disc-1", key: "pitching", label: "Pitching" },
          { id: "disc-2", key: "hitting", label: "Hitting" },
        ],
        mechanicOptions,
        drillOptions,
        initialDisciplineId: "disc-2",
      })
    );

    act(() => {
      result.current.setFieldValue("developmentPlanId", "plan-1");
    });

    expect(result.current.values.disciplineId).toBe("disc-1");
    expect(result.current.selectedDiscipline?.id).toBe("disc-1");
  });

  it("serializes plan-derived player visibility and discipline into the payload", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: "routine-1" }),
    });

    const { result } = renderHook(() =>
      useRoutineForm({
        mode: "create",
        contextType: "development-plan",
        createdBy: "coach-1",
        initialPlayerId: "player-1",
        developmentPlanOptions,
        disciplineOptions: [{ id: "disc-1", key: "pitching", label: "Pitching" }],
        mechanicOptions,
        drillOptions,
        initialDevelopmentPlanId: "plan-1",
      })
    );

    act(() => {
      result.current.setFieldValue("title", "Routine");
      result.current.addMechanic();
      result.current.updateMechanic(0, {
        mechanicId: "mech-1",
        title: "Front-side timing",
      });
      result.current.addBlock();
      result.current.updateBlock(0, { title: "Block 1" });
      result.current.addDrillsToBlock(0, ["drill-1"]);
    });

    await act(async () => {
      await result.current.handleSubmit("save");
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/routines",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"visibility":"player"'),
      })
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/routines",
      expect.objectContaining({
        body: expect.stringContaining('"playerId":"player-1"'),
      })
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/routines",
      expect.objectContaining({
        body: expect.stringContaining('"disciplineId":"disc-1"'),
      })
    );
  });

  it("reorders blocks and drills and serializes sort order from the UI order", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: "routine-1" }),
    });

    const { result } = renderHook(() =>
      useRoutineForm({
        mode: "create",
        contextType: "development-plan",
        createdBy: "coach-1",
        initialPlayerId: "player-1",
        developmentPlanOptions,
        disciplineOptions: [{ id: "disc-1", key: "pitching", label: "Pitching" }],
        mechanicOptions,
        drillOptions,
        initialDevelopmentPlanId: "plan-1",
      })
    );

    act(() => {
      result.current.setFieldValue("title", "Routine");
      result.current.addMechanic();
      result.current.updateMechanic(0, {
        mechanicId: "mech-1",
        title: "Front-side timing",
      });
      result.current.addBlock();
      result.current.updateBlock(0, { title: "First block" });
      result.current.addDrillsToBlock(0, ["drill-1", "drill-2"]);
      result.current.addBlock();
      result.current.updateBlock(1, { title: "Second block" });
      result.current.addDrillsToBlock(1, ["drill-1"]);
      result.current.reorderBlocks(1, 0);
      result.current.reorderDrillsInBlock(1, 1, 0);
    });

    await act(async () => {
      await result.current.handleSubmit("save");
    });

    const [, request] = (global.fetch as jest.Mock).mock.calls[0];
    const payload = JSON.parse(request.body as string);

    expect(
      payload.documentData.blocks.map((block: { title: string; sortOrder: number }) => ({
        title: block.title,
        sortOrder: block.sortOrder,
      }))
    ).toEqual([
      { title: "Second block", sortOrder: 0 },
      { title: "First block", sortOrder: 1 },
    ]);
    expect(
      payload.documentData.blocks[1].drills.map(
        (drill: { drillId: string; sortOrder: number }) => ({
          drillId: drill.drillId,
          sortOrder: drill.sortOrder,
        })
      )
    ).toEqual([
      { drillId: "drill-2", sortOrder: 0 },
      { drillId: "drill-1", sortOrder: 1 },
    ]);
  });

  it("surfaces api failures as form errors", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Routine create failed." }),
    });

    const { result } = renderHook(() =>
      useRoutineForm({
        mode: "create",
        contextType: "development-plan",
        createdBy: "coach-1",
        initialPlayerId: "player-1",
        developmentPlanOptions,
        disciplineOptions: [{ id: "disc-1", key: "pitching", label: "Pitching" }],
        mechanicOptions,
        drillOptions,
        initialDevelopmentPlanId: "plan-1",
      })
    );

    act(() => {
      result.current.setFieldValue("title", "Routine");
      result.current.addMechanic();
      result.current.updateMechanic(0, {
        mechanicId: "mech-1",
        title: "Front-side timing",
      });
      result.current.addBlock();
      result.current.updateBlock(0, { title: "Block 1" });
      result.current.addDrillsToBlock(0, ["drill-1"]);
    });

    await act(async () => {
      await result.current.handleSubmit("save");
    });

    await waitFor(() => {
      expect(result.current.errors.form).toBe("Routine create failed.");
    });
  });

  it("adds multiple drills to a block with hydrated titles and stable sort order", () => {
    const { result } = renderHook(() =>
      useRoutineForm({
        mode: "create",
        contextType: "development-plan",
        createdBy: "coach-1",
        initialPlayerId: "player-1",
        developmentPlanOptions,
        disciplineOptions: [{ id: "disc-1", key: "pitching", label: "Pitching" }],
        mechanicOptions,
        drillOptions,
        initialDevelopmentPlanId: "plan-1",
      })
    );

    act(() => {
      result.current.addBlock();
      result.current.addDrillsToBlock(0, ["drill-2", "drill-1"]);
      result.current.addDrillsToBlock(0, ["drill-1"]);
    });

    expect(result.current.values.blocks[0].drills.map((drill) => drill.drillId)).toEqual([
      "drill-2",
      "drill-1",
    ]);
    expect(result.current.values.blocks[0].drills.map((drill) => drill.title)).toEqual([
      "Balance drill",
      "Stride timing drill",
    ]);
    expect(result.current.values.blocks[0].drills.map((drill) => drill.sortOrder)).toEqual([
      0,
      1,
    ]);
  });
});
