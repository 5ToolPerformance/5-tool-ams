import { render, screen } from "@testing-library/react";

import { EvaluationEvidenceStep } from "@/ui/features/development/forms/evaluation/EvaluationEvidenceStep";

const useEvaluationFormContext = jest.fn();

jest.mock(
  "@/ui/features/development/forms/evaluation/EvaluationFormProvider",
  () => ({
    useEvaluationFormContext: () => useEvaluationFormContext(),
  })
);

describe("EvaluationEvidenceStep", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows discipline-specific evidence actions for hitting", () => {
    useEvaluationFormContext.mockReturnValue({
      selectedDiscipline: { id: "disc-1", key: "hitting", label: "Hitting" },
      values: { evidence: [], mediaAttachments: [] },
      errors: {},
      addEvidence: jest.fn(),
      updateEvidence: jest.fn(),
      removeEvidence: jest.fn(),
      addMediaAttachments: jest.fn(),
      removeMediaAttachment: jest.fn(),
    });

    render(<EvaluationEvidenceStep />);

    expect(screen.getByRole("button", { name: "Add HitTrax" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Add Blast" })).toBeTruthy();
    expect(screen.getByText("Media Uploads")).toBeTruthy();
  });

  it("renders the Blast power average input", () => {
    useEvaluationFormContext.mockReturnValue({
      selectedDiscipline: { id: "disc-1", key: "hitting", label: "Hitting" },
      values: {
        evidence: [
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
            powerAvg: "",
          },
        ],
        mediaAttachments: [],
      },
      errors: {},
      addEvidence: jest.fn(),
      updateEvidence: jest.fn(),
      removeEvidence: jest.fn(),
      addMediaAttachments: jest.fn(),
      removeMediaAttachment: jest.fn(),
    });

    render(<EvaluationEvidenceStep />);

    expect(screen.getByLabelText("Power Avg")).toBeTruthy();
    expect(screen.queryByLabelText("Recorded At")).toBeNull();
  });

  it("renders an empty state for unsupported disciplines", () => {
    useEvaluationFormContext.mockReturnValue({
      selectedDiscipline: { id: "disc-2", key: "pitching", label: "Pitching" },
      values: { evidence: [], mediaAttachments: [] },
      errors: {},
      addEvidence: jest.fn(),
      updateEvidence: jest.fn(),
      removeEvidence: jest.fn(),
      addMediaAttachments: jest.fn(),
      removeMediaAttachment: jest.fn(),
    });

    render(<EvaluationEvidenceStep />);

    expect(
      screen.getByText("Evidence forms are not configured for Pitching.")
    ).toBeTruthy();
  });

  it("renders raw strength test inputs and hides legacy score inputs", () => {
    useEvaluationFormContext.mockReturnValue({
      selectedDiscipline: { id: "disc-3", key: "strength", label: "Strength" },
      values: {
        evidence: [
          {
            id: "evidence-1",
            type: "strength",
            recordedAt: "2026-03-24T09:30",
            notes: "",
            plyoPushup: "80",
            seatedShoulderErL: "75",
            seatedShoulderErR: "70",
            seatedShoulderIrL: "",
            seatedShoulderIrR: "",
            cmj: "",
            cmjPropulsiveImpulse: "",
            cmjPeakPower: "",
            pogoJump: "",
            dropJump: "",
            midThighPull: "",
            midThighPullTtpf: "",
            netForce100ms: "",
            shotPut: "",
            scoopToss: "",
          },
        ],
        mediaAttachments: [],
      },
      errors: {},
      addEvidence: jest.fn(),
      updateEvidence: jest.fn(),
      removeEvidence: jest.fn(),
      addMediaAttachments: jest.fn(),
      removeMediaAttachment: jest.fn(),
    });

    render(<EvaluationEvidenceStep />);

    expect(screen.getAllByText("Plyo Pushup").length).toBeGreaterThan(0);
    expect(screen.getByText("Seated Shoulder ER")).toBeTruthy();
    expect(screen.getByText("Seated Shoulder IR")).toBeTruthy();
    expect(screen.getByText("Counter Movement Jump")).toBeTruthy();
    expect(screen.getAllByText("Pogo Jump").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Drop Jump").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Mid Thigh Pull").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Shot Put").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Scoop Toss").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("Left")).toHaveLength(2);
    expect(screen.getAllByLabelText("Right")).toHaveLength(2);
    expect(screen.getByLabelText("Propulsive Impulse")).toBeTruthy();
    expect(screen.getByLabelText("Peak Power")).toBeTruthy();
    expect(screen.getByLabelText("TTPF")).toBeTruthy();
    expect(screen.getByLabelText("Net Force 100ms")).toBeTruthy();
    expect(screen.queryByLabelText("Rotation Score")).toBeNull();
    expect(screen.queryByLabelText("Lower Body Score")).toBeNull();
    expect(screen.queryByLabelText("Upper Body Score")).toBeNull();
    expect(screen.queryByLabelText("Power Rating")).toBeNull();
  });
});
