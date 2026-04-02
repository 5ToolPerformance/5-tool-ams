import {
  serializeEvaluationFormToPayload,
  serializeEvaluationFormToDocumentData,
} from "@/ui/features/development/forms/evaluation/evaluationForm.serialization";

import { createEmptyEvaluationFormValues } from "../evaluationForm.defaults";

describe("evaluationForm.serialization", () => {
  it("serializes blank focus area placeholders when the form is submitted", () => {
    const values = createEmptyEvaluationFormValues();
    values.disciplineId = "disc-1";
    values.evaluationDate = "2026-03-24";
    values.snapshotSummary = "Snapshot summary";
    values.strengthProfileSummary = "Strength summary";
    values.keyConstraintsSummary = "Constraint summary";

    const documentData = serializeEvaluationFormToDocumentData(values);

    expect(documentData.focusAreas).toEqual([
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
    ]);
  });

  it("overwrites existing focus areas in the payload with blank placeholders", () => {
    const values = createEmptyEvaluationFormValues();
    values.disciplineId = "disc-1";
    values.evaluationDate = "2026-03-24";
    values.snapshotSummary = "Snapshot summary";
    values.strengthProfileSummary = "Strength summary";
    values.keyConstraintsSummary = "Constraint summary";
    values.focusAreas = [
      {
        id: "focus-1",
        title: "Should not persist",
        description: "Removed from the form flow",
      },
    ];

    const payload = serializeEvaluationFormToPayload(values, {
      playerId: "player-1",
      disciplineId: "disc-1",
      createdBy: "coach-1",
    });

    expect(payload.documentData.focusAreas).toEqual([
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
    ]);
  });

  it("serializes evidence forms into the payload body instead of document data", () => {
    const values = createEmptyEvaluationFormValues();
    values.disciplineId = "disc-1";
    values.evaluationDate = "2026-03-24";
    values.snapshotSummary = "Snapshot summary";
    values.strengthProfileSummary = "Strength summary";
    values.keyConstraintsSummary = "Constraint summary";
    values.evidence = [
      {
        id: "evidence-1",
        type: "hittrax",
        recordedAt: "2026-03-24T09:30",
        notes: "Manual capture",
        exitVelocityMax: "92.4",
        exitVelocityAvg: "",
        hardHitPercent: "",
        launchAngleAvg: "12.1",
        lineDriveAvg: "",
      },
    ];

    const payload = serializeEvaluationFormToPayload(values, {
      playerId: "player-1",
      disciplineId: "disc-1",
      createdBy: "coach-1",
    });

    expect(payload.documentData.evidence).toBeUndefined();
    expect(payload.evidenceForms).toEqual([
      expect.objectContaining({
        type: "hittrax",
        notes: "Manual capture",
        exitVelocityMax: "92.4",
        exitVelocityAvg: null,
        launchAngleAvg: "12.1",
      }),
    ]);
  });

  it("serializes strength evidence component scores into the payload body", () => {
    const values = createEmptyEvaluationFormValues();
    values.disciplineId = "disc-1";
    values.evaluationDate = "2026-03-24";
    values.snapshotSummary = "Snapshot summary";
    values.strengthProfileSummary = "Strength summary";
    values.keyConstraintsSummary = "Constraint summary";
    values.evidence = [
      {
        id: "evidence-1",
        type: "strength",
        recordedAt: "2026-03-24T09:30",
        notes: "Force plate review",
        rotation: "88",
        lowerBodyStrength: "81",
        upperBodyStrength: "74",
        powerRating: "",
      },
    ];

    const payload = serializeEvaluationFormToPayload(values, {
      playerId: "player-1",
      disciplineId: "disc-1",
      createdBy: "coach-1",
    });

    expect(payload.evidenceForms).toEqual([
      expect.objectContaining({
        type: "strength",
        notes: "Force plate review",
        rotation: "88",
        lowerBodyStrength: "81",
        upperBodyStrength: "74",
        powerRating: null,
      }),
    ]);
  });

  it("injects placeholder summaries for tests-only evaluations", () => {
    const values = createEmptyEvaluationFormValues();
    values.disciplineId = "disc-1";
    values.evaluationDate = "2026-03-24";
    values.evaluationType = "tests_only";

    const payload = serializeEvaluationFormToPayload(values, {
      playerId: "player-1",
      disciplineId: "disc-1",
      createdBy: "coach-1",
    });

    expect(payload.snapshotSummary).toBe("Tests-only evaluation");
    expect(payload.strengthProfileSummary).toBe("Tests-only evaluation");
    expect(payload.keyConstraintsSummary).toBe("Tests-only evaluation");
  });
});
