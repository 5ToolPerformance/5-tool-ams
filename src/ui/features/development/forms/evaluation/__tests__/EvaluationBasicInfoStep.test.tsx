import { render, screen } from "@testing-library/react";

import { EvaluationBasicInfoStep } from "@/ui/features/development/forms/evaluation/EvaluationBasicInfoStep";

const useEvaluationFormContext = jest.fn();

jest.mock(
  "@/ui/features/development/forms/evaluation/EvaluationFormProvider",
  () => ({
    useEvaluationFormContext: () => useEvaluationFormContext(),
  })
);

describe("EvaluationBasicInfoStep", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders discipline options from form config", () => {
    useEvaluationFormContext.mockReturnValue({
      mode: "create",
      disciplineOptions: [
        { id: "disc-1", key: "pitching", label: "Pitching" },
        { id: "disc-2", key: "hitting", label: "Hitting" },
      ],
      values: {
        disciplineId: "",
        evaluationDate: "2026-03-16",
        evaluationType: "general",
        phase: "general",
        injuryConsiderations: "",
      },
      errors: {},
      setFieldValue: jest.fn(),
    });

    render(<EvaluationBasicInfoStep />);

    expect(screen.getByText("Pitching")).toBeTruthy();
    expect(screen.getByText("Hitting")).toBeTruthy();
  });

  it("locks the discipline selector in edit mode", () => {
    useEvaluationFormContext.mockReturnValue({
      mode: "edit",
      disciplineOptions: [{ id: "disc-1", key: "pitching", label: "Pitching" }],
      values: {
        disciplineId: "disc-1",
        evaluationDate: "2026-03-16",
        evaluationType: "general",
        phase: "general",
        injuryConsiderations: "",
      },
      errors: {},
      setFieldValue: jest.fn(),
    });

    render(<EvaluationBasicInfoStep />);

    expect(
      screen.getByRole("button", { name: "Pitching Discipline" }).getAttribute(
        "data-disabled"
      )
    ).toBe("true");
  });
});
