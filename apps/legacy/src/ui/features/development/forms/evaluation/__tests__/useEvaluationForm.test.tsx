import { renderHook, act } from "@testing-library/react";

import { useEvaluationForm } from "@/ui/features/development/forms/evaluation/useEvaluationForm";

describe("useEvaluationForm", () => {
  const disciplineOptions = [
    { id: "disc-1", key: "hitting", label: "Hitting" },
    { id: "disc-2", key: "strength", label: "Strength" },
  ];

  const bucketOptions = [
    {
      id: "bucket-1",
      disciplineId: "disc-1",
      key: "velo",
      label: "Velocity",
      description: "Fastball velocity",
      sortOrder: 2,
      active: true,
    },
    {
      id: "bucket-2",
      disciplineId: "disc-1",
      key: "command",
      label: "Command",
      description: "Strike quality",
      sortOrder: 1,
      active: true,
    },
    {
      id: "bucket-3",
      disciplineId: "disc-2",
      key: "power",
      label: "Power",
      description: "Impact output",
      sortOrder: 1,
      active: true,
    },
  ];

  it("hydrates all buckets for the selected discipline in create mode", () => {
    const { result } = renderHook(() =>
      useEvaluationForm({
        mode: "create",
        playerId: "player-1",
        createdBy: "coach-1",
        disciplineOptions,
        bucketOptions,
      })
    );

    act(() => {
      result.current.setFieldValue("disciplineId", "disc-1");
    });

    expect(result.current.values.buckets).toHaveLength(2);
    expect(result.current.values.buckets.map((bucket) => bucket.bucketId)).toEqual([
      "bucket-2",
      "bucket-1",
    ]);
    expect(result.current.values.buckets.every((bucket) => bucket.status === "")).toBe(
      true
    );
  });

  it("maps saved bucket statuses onto the configured discipline buckets in edit mode", () => {
    const { result } = renderHook(() =>
      useEvaluationForm({
        mode: "edit",
        createdBy: "coach-1",
        disciplineOptions,
        bucketOptions,
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

    expect(result.current.values.buckets).toHaveLength(2);
    expect(result.current.values.buckets[0]).toMatchObject({
      bucketId: "bucket-2",
      status: "",
    });
    expect(result.current.values.buckets[1]).toMatchObject({
      bucketId: "bucket-1",
      status: "developing",
    });
  });

  it("removes unsupported evidence forms when the discipline changes", () => {
    const { result } = renderHook(() =>
      useEvaluationForm({
        mode: "create",
        playerId: "player-1",
        createdBy: "coach-1",
        disciplineOptions,
        bucketOptions,
      })
    );

    act(() => {
      result.current.setFieldValue("disciplineId", "disc-1");
      result.current.addEvidence("hittrax");
      result.current.setFieldValue("disciplineId", "disc-2");
    });

    expect(result.current.values.evidence).toEqual([]);
  });

  it("hydrates uploaded media attachments in edit mode", () => {
    const { result } = renderHook(() =>
      useEvaluationForm({
        mode: "edit",
        createdBy: "coach-1",
        disciplineOptions,
        bucketOptions,
        initialEvaluation: {
          id: "eval-1",
          playerId: "player-1",
          disciplineId: "disc-1",
          createdBy: "coach-1",
          evaluationDate: "2026-03-16",
          evaluationType: "tests_only",
          phase: "general",
          injuryConsiderations: null,
          snapshotSummary: "Tests-only evaluation",
          strengthProfileSummary: "Tests-only evaluation",
          keyConstraintsSummary: "Tests-only evaluation",
          documentData: { version: 1 },
          mediaAttachments: [
            {
              id: "attachment-1",
              type: "file_image",
              source: "evaluation_media",
              createdAt: "2026-03-16T12:00:00.000Z",
              file: {
                originalFileName: "capture.png",
                mimeType: "image/png",
                fileSizeBytes: 123,
                storageKey: "storage-key",
              },
            },
          ],
        },
      })
    );

    expect(result.current.values.mediaAttachments).toEqual([
      expect.objectContaining({
        status: "uploaded",
        attachmentId: "attachment-1",
        fileName: "capture.png",
        type: "file_image",
      }),
    ]);
  });
});
