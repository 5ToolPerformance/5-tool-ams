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
});
