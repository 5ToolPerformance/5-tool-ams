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

  it("serializes Blast power average into the payload body", () => {
    const values = createEmptyEvaluationFormValues();
    values.disciplineId = "disc-1";
    values.evaluationDate = "2026-03-24";
    values.snapshotSummary = "Snapshot summary";
    values.strengthProfileSummary = "Strength summary";
    values.keyConstraintsSummary = "Constraint summary";
    values.evidence = [
      {
        id: "evidence-1",
        type: "blast",
        recordedAt: "2026-03-24T09:30",
        notes: "",
        batSpeedMax: "",
        batSpeedAvg: "",
        rotAccMax: "",
        rotAccAvg: "",
        onPlanePercent: "",
        attackAngleAvg: "",
        earlyConnAvg: "",
        connAtImpactAvg: "",
        verticalBatAngleAvg: "",
        timeToContactAvg: "",
        handSpeedMax: "",
        handSpeedAvg: "",
        powerAvg: "54.2",
      },
    ];

    const payload = serializeEvaluationFormToPayload(values, {
      playerId: "player-1",
      disciplineId: "disc-1",
      createdBy: "coach-1",
    });

    expect(payload.evidenceForms).toEqual([
      expect.objectContaining({
        type: "blast",
        powerAvg: "54.2",
      }),
    ]);
  });

  it("uses the evaluation date for evidence recordedAt", () => {
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
        recordedAt: "",
        notes: "",
        exitVelocityMax: "92.4",
        exitVelocityAvg: "",
        hardHitPercent: "",
        launchAngleAvg: "",
        lineDriveAvg: "",
      },
    ];

    const payload = serializeEvaluationFormToPayload(values, {
      playerId: "player-1",
      disciplineId: "disc-1",
      createdBy: "coach-1",
    });

    expect(payload.evidenceForms).toEqual([
      expect.objectContaining({
        recordedAt: new Date("2026-03-24T00:00:00"),
      }),
    ]);
  });

  it("serializes raw strength evidence metrics and preserves hidden legacy scores", () => {
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
        notes: "Raw test capture",
        powerRating: "91",
        rotation: "88",
        lowerBodyStrength: "81",
        upperBodyStrength: "74",
        plyoPushup: "18",
        seatedShoulderErL: "22",
        seatedShoulderErR: "24",
        seatedShoulderIrL: "30",
        seatedShoulderIrR: "31",
        cmj: "28",
        cmjPropulsiveImpulse: "140",
        cmjPeakPower: "4200",
        pogoJump: "2.1",
        dropJump: "1.8",
        midThighPull: "650",
        midThighPullTtpf: "0.42",
        netForce100ms: "310",
        shotPut: "32",
        scoopToss: "34",
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
        powerRating: "91",
        rotation: "88",
        lowerBodyStrength: "81",
        upperBodyStrength: "74",
        plyoPushup: "18",
        seatedShoulderErL: "22",
        seatedShoulderErR: "24",
        cmjPeakPower: "4200",
        midThighPull: "650",
        scoopToss: "34",
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
