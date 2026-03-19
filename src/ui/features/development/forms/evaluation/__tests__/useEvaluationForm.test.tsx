import { renderHook, act } from "@testing-library/react";

import { useEvaluationForm } from "@/ui/features/development/forms/evaluation/useEvaluationForm";

describe("useEvaluationForm", () => {
  it("clears buckets when discipline changes in create mode", () => {
    const { result } = renderHook(() =>
      useEvaluationForm({
        mode: "create",
        playerId: "player-1",
        createdBy: "coach-1",
      })
    );

    act(() => {
      result.current.setFieldValue("buckets", [
        {
          id: "bucket-row-1",
          bucketId: "bucket-1",
          status: "developing",
          notes: "",
        },
      ]);
      result.current.setFieldValue("disciplineId", "disc-1");
      result.current.setFieldValue("disciplineId", "disc-2");
    });

    expect(result.current.values.buckets).toEqual([]);
  });

  it("retains buckets when discipline is fixed in edit mode", () => {
    const { result } = renderHook(() =>
      useEvaluationForm({
        mode: "edit",
        createdBy: "coach-1",
        initialEvaluation: {
          id: "eval-1",
          playerId: "player-1",
          disciplineId: "disc-1",
          createdBy: "coach-1",
          evaluationDate: "2026-03-16",
          evaluationType: "general",
          phase: "general",
          injuryConsiderations: null,
          snapshotSummary: "Snapshot",
          strengthProfileSummary: "Strength",
          keyConstraintsSummary: "Constraint",
          documentData: {
            version: 1,
            buckets: [
              {
                bucketId: "bucket-1",
                status: "developing",
              },
            ],
          },
        },
      })
    );

    act(() => {
      result.current.setFieldValue("disciplineId", "disc-2");
    });

    expect(result.current.values.buckets).toHaveLength(1);
    expect(result.current.values.buckets[0]?.bucketId).toBe("bucket-1");
  });
});
