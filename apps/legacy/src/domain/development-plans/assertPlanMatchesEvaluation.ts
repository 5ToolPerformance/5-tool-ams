import { DomainError } from "@/domain/errors";

export function assertPlanMatchesEvaluation(params: {
  evaluation: {
    id: string;
    playerId: string;
    disciplineId: string;
  };
  input: {
    playerId: string;
    disciplineId: string;
    evaluationId: string;
  };
}) {
  const { evaluation, input } = params;

  if (evaluation.id !== input.evaluationId) {
    throw new DomainError(
      "Development plan must reference the provided evaluation."
    );
  }

  if (evaluation.playerId !== input.playerId) {
    throw new DomainError(
      "Development plan player must match evaluation player."
    );
  }

  if (evaluation.disciplineId !== input.disciplineId) {
    throw new DomainError(
      "Development plan discipline must match evaluation discipline."
    );
  }
}
