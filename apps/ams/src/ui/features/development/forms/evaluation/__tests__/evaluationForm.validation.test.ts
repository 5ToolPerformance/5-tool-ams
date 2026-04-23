import { createEmptyEvaluationFormValues } from "@/ui/features/development/forms/evaluation/evaluationForm.defaults";
import { validateEvaluationForm } from "@/ui/features/development/forms/evaluation/evaluationForm.validation";

describe("evaluationForm.validation", () => {
  it("does not require narrative summaries for tests-only evaluations", () => {
    const values = createEmptyEvaluationFormValues();
    values.disciplineId = "disc-1";
    values.evaluationDate = "2026-03-24";
    values.evaluationType = "tests_only";

    const errors = validateEvaluationForm(values);

    expect(errors.snapshotSummary).toBeUndefined();
    expect(errors.strengthProfileSummary).toBeUndefined();
    expect(errors.keyConstraintsSummary).toBeUndefined();
  });
});
