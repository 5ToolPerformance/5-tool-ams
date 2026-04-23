import type {
  EvaluationFormErrorMap,
  EvaluationFormValues,
} from "./evaluationForm.types";

export function validateEvaluationForm(
  values: EvaluationFormValues
): EvaluationFormErrorMap {
  const errors: EvaluationFormErrorMap = {};
  const isTestsOnly = values.evaluationType === "tests_only";

  if (!values.disciplineId) {
    errors.disciplineId = "Discipline is required.";
  }

  if (!values.evaluationDate) {
    errors.evaluationDate = "Evaluation date is required.";
  }

  if (!values.evaluationType) {
    errors.evaluationType = "Evaluation type is required.";
  }

  if (!values.phase) {
    errors.phase = "Phase is required.";
  }

  if (!isTestsOnly && !values.snapshotSummary.trim()) {
    errors.snapshotSummary = "Snapshot summary is required.";
  }

  if (!isTestsOnly && !values.strengthProfileSummary.trim()) {
    errors.strengthProfileSummary = "Strength profile summary is required.";
  }

  if (!isTestsOnly && !values.keyConstraintsSummary.trim()) {
    errors.keyConstraintsSummary = "Key constraints summary is required.";
  }

  if (!isTestsOnly) {
    values.buckets.forEach((item, index) => {
      if (!item.bucketId) {
        errors[`buckets.${index}.bucketId`] = "Bucket is required.";
      }

      if (!item.status) {
        errors[`buckets.${index}.status`] = "Status is required.";
      }
    });

    const selectedBucketIds = values.buckets
      .map((item) => item.bucketId)
      .filter(Boolean);

    if (new Set(selectedBucketIds).size !== selectedBucketIds.length) {
      errors.buckets = "Each bucket can only be selected once.";
    }
  }

  const selectedEvidenceTypes = values.evidence.map((item) => item.type);

  if (new Set(selectedEvidenceTypes).size !== selectedEvidenceTypes.length) {
    errors.evidence = "Each evidence type can only be added once.";
  }

  return errors;
}

export function hasEvaluationFormErrors(
  errors: EvaluationFormErrorMap
): boolean {
  return Object.keys(errors).length > 0;
}
