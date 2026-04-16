export type DevelopmentReportQuery = {
  disciplineId: string | null;
  includeEvidence: boolean;
  routineIds: string[];
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseDevelopmentReportQuery(input: {
  discipline?: string | string[];
  includeEvidence?: string | string[];
  routineIds?: string | string[];
}): DevelopmentReportQuery {
  const disciplineId = firstValue(input.discipline) ?? null;
  const includeEvidence = firstValue(input.includeEvidence) === "1";
  const routineIds = Array.from(
    new Set(
      (Array.isArray(input.routineIds) ? input.routineIds : [input.routineIds])
        .filter((value): value is string => typeof value === "string")
        .flatMap((value) => value.split(","))
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );

  return {
    disciplineId,
    includeEvidence,
    routineIds,
  };
}

export function buildDevelopmentReportPdfPath(input: {
  playerId: string;
  disciplineId: string;
  includeEvidence: boolean;
  routineIds: string[];
}) {
  const params = new URLSearchParams();
  params.set("discipline", input.disciplineId);

  if (input.includeEvidence) {
    params.set("includeEvidence", "1");
  }

  if (input.routineIds.length > 0) {
    params.set("routineIds", input.routineIds.join(","));
  }

  return `/reports/development/${input.playerId}/pdf?${params.toString()}`;
}
