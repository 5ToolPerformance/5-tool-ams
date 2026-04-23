import { render, screen } from "@testing-library/react";

import { EvaluationForm } from "@/ui/features/development/forms/evaluation/EvaluationForm";

const useEvaluationFormContext = jest.fn();

jest.mock(
  "@/ui/features/development/forms/evaluation/EvaluationFormProvider",
  () => ({
    useEvaluationFormContext: () => useEvaluationFormContext(),
  })
);

describe("EvaluationForm", () => {
  function createContext(evaluationType: "tests_only" | "general") {
    return {
      mode: "create",
      values: {
        disciplineId: "",
        evaluationDate: "2026-03-26",
        evaluationType,
        phase: "general",
        injuryConsiderations: "",
      },
      disciplineOptions: [],
      isSubmitting: false,
      handleSubmit: jest.fn(),
      setFieldValue: jest.fn(),
      errors: {},
    };
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows a two-step flow for tests-only evaluations", () => {
    useEvaluationFormContext.mockReturnValue(createContext("tests_only"));

    render(<EvaluationForm />);

    expect(screen.getByText(/Step 1 of 2:/)).toBeTruthy();
    expect(screen.getByText("Basic Info")).toBeTruthy();
  });

  it("keeps the standard six-step flow for non-tests-only evaluations", () => {
    useEvaluationFormContext.mockReturnValue(createContext("general"));

    render(<EvaluationForm />);

    expect(screen.getByText(/Step 1 of 6:/)).toBeTruthy();
    expect(screen.getByText("Basic Info")).toBeTruthy();
  });
});
