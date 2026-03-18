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
];

describe("useRoutineForm", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("fails validation when no development plan is selected", async () => {
    const { result } = renderHook(() =>
      useRoutineForm({
        mode: "create",
        createdBy: "coach-1",
        developmentPlanOptions,
        mechanicOptions,
        drillOptions,
      })
    );

    await act(async () => {
      await result.current.handleSubmit("save");
    });

    expect(result.current.errors.developmentPlanId).toBe(
      "Development plan is required."
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("serializes plan-derived player visibility and discipline into the payload", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: "routine-1" }),
    });

    const { result } = renderHook(() =>
      useRoutineForm({
        mode: "create",
        createdBy: "coach-1",
        developmentPlanOptions,
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
      result.current.addDrillToBlock(0);
      result.current.updateDrillInBlock(0, 0, {
        drillId: "drill-1",
        title: "Stride timing drill",
      });
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
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/routines",
      expect.objectContaining({
        body: expect.stringContaining('"mechanicId":"mech-1"'),
      })
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/routines",
      expect.objectContaining({
        body: expect.stringContaining('"drillId":"drill-1"'),
      })
    );
  });

  it("surfaces api failures as form errors", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Routine create failed." }),
    });

    const { result } = renderHook(() =>
      useRoutineForm({
        mode: "create",
        createdBy: "coach-1",
        developmentPlanOptions,
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
      result.current.addDrillToBlock(0);
      result.current.updateDrillInBlock(0, 0, {
        drillId: "drill-1",
        title: "Stride timing drill",
      });
    });

    await act(async () => {
      await result.current.handleSubmit("save");
    });

    await waitFor(() => {
      expect(result.current.errors.form).toBe("Routine create failed.");
    });
  });
});
