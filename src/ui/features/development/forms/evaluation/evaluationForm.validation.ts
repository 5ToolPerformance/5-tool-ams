import type {
  EvaluationFormErrorMap,
  EvaluationFormValues,
} from "./evaluationForm.types";

export function validateEvaluationForm(
  values: EvaluationFormValues
): EvaluationFormErrorMap {
  const errors: EvaluationFormErrorMap = {};

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

  if (!values.snapshotSummary.trim()) {
    errors.snapshotSummary = "Snapshot summary is required.";
  }

  if (!values.strengthProfileSummary.trim()) {
    errors.strengthProfileSummary = "Strength profile summary is required.";
  }

  if (!values.keyConstraintsSummary.trim()) {
    errors.keyConstraintsSummary = "Key constraints summary is required.";
  }

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

  values.evidence.forEach((item, index) => {
    if (!item.performanceSessionId.trim()) {
      errors[`evidence.${index}.performanceSessionId`] =
        "Performance session is required.";
    }
  });

  return errors;
}

export function hasEvaluationFormErrors(
  errors: EvaluationFormErrorMap
): boolean {
  return Object.keys(errors).length > 0;
}
