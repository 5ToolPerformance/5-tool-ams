import type { EvaluationStrengthEvidenceInput } from "@/domain/evaluations/evidence";

const ROTATION_WEIGHT = 0.45;
const LOWER_BODY_WEIGHT = 0.35;
const UPPER_BODY_WEIGHT = 0.2;

function parseMetricValue(value: string | null | undefined): number | null {
  if (value == null) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);

  return Number.isFinite(parsed) ? parsed : null;
}

export function resolveStrengthEvidencePowerRating(
  evidence: Pick<
    EvaluationStrengthEvidenceInput,
    "powerRating" | "rotation" | "lowerBodyStrength" | "upperBodyStrength"
  >
): string | null {
  const explicitPowerRating = evidence.powerRating?.trim();

  if (explicitPowerRating) {
    return explicitPowerRating;
  }

  const rotation = parseMetricValue(evidence.rotation);
  const lowerBody = parseMetricValue(evidence.lowerBodyStrength);
  const upperBody = parseMetricValue(evidence.upperBodyStrength);

  if (rotation == null || lowerBody == null || upperBody == null) {
    return null;
  }

  const calculated =
    rotation * ROTATION_WEIGHT +
    lowerBody * LOWER_BODY_WEIGHT +
    upperBody * UPPER_BODY_WEIGHT;

  return calculated.toFixed(2);
}
