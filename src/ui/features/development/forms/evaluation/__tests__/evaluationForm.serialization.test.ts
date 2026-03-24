import {
  serializeEvaluationFormToDocumentData,
  serializeEvaluationFormToPayload,
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
});
