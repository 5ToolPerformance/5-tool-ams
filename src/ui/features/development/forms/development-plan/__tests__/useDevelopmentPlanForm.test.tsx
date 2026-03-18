import { act, renderHook, waitFor } from "@testing-library/react";

import { useDevelopmentPlanForm } from "@/ui/features/development/forms/development-plan/useDevelopmentPlanForm";

const originalFetch = global.fetch;

const evaluationOptions = [
  {
    id: "eval-1",
    disciplineId: "disc-1",
    disciplineLabel: "Pitching",
    evaluationDate: "2026-03-16",
    evaluationType: "monthly",
    phase: "preseason",
    summary: "Snapshot",
  },
];

describe("useDevelopmentPlanForm", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("fails validation in create mode when no evaluation is selected", async () => {
    const { result } = renderHook(() =>
      useDevelopmentPlanForm({
        mode: "create",
        playerId: "player-1",
        createdBy: "coach-1",
        evaluationOptions,
      })
    );

    await act(async () => {
      await result.current.handleSubmit("save");
    });

    expect(result.current.errors.evaluationId).toBe("Evaluation is required.");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("serializes the selected evaluation discipline into the payload", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: "plan-1" }),
    });

    const { result } = renderHook(() =>
      useDevelopmentPlanForm({
        mode: "create",
        playerId: "player-1",
        createdBy: "coach-1",
        evaluationOptions,
        initialEvaluationId: "eval-1",
      })
    );

    await act(async () => {
      await result.current.handleSubmit("save");
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/development-plans",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"disciplineId":"disc-1"'),
      })
    );
  });

  it("calls the save-and-routine callback when that action succeeds", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: "plan-1" }),
    });

    const onSavedAndContinue = jest.fn();

    const { result } = renderHook(() =>
      useDevelopmentPlanForm({
        mode: "create",
        playerId: "player-1",
        createdBy: "coach-1",
        evaluationOptions,
        initialEvaluationId: "eval-1",
        onSavedAndContinue,
      })
    );

    await act(async () => {
      await result.current.handleSubmit("save-and-routine");
    });

    expect(onSavedAndContinue).toHaveBeenCalledWith("plan-1");
  });

  it("surfaces api failures as form errors", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Plan create failed." }),
    });

    const { result } = renderHook(() =>
      useDevelopmentPlanForm({
        mode: "create",
        playerId: "player-1",
        createdBy: "coach-1",
        evaluationOptions,
        initialEvaluationId: "eval-1",
      })
    );

    await act(async () => {
      await result.current.handleSubmit("save");
    });

    await waitFor(() => {
      expect(result.current.errors.form).toBe("Plan create failed.");
    });
  });
});
