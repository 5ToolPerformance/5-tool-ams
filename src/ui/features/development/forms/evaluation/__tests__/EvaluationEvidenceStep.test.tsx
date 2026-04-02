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

  it("renders the three strength score inputs and hides power rating input", () => {
    useEvaluationFormContext.mockReturnValue({
      selectedDiscipline: { id: "disc-3", key: "strength", label: "Strength" },
      values: {
        evidence: [
          {
            id: "evidence-1",
            type: "strength",
            recordedAt: "2026-03-24T09:30",
            notes: "",
            rotation: "80",
            lowerBodyStrength: "75",
            upperBodyStrength: "70",
            powerRating: "",
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

    expect(screen.getByLabelText("Rotation Score")).toBeTruthy();
    expect(screen.getByLabelText("Lower Body Score")).toBeTruthy();
    expect(screen.getByLabelText("Upper Body Score")).toBeTruthy();
    expect(screen.queryByLabelText("Power Rating")).toBeNull();
  });
});
