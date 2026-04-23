export type PlayerRoutinesPdfQuery = {
  disciplineId: string | null;
  routineIds: string[];
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parsePlayerRoutinesPdfQuery(input: {
  discipline?: string | string[];
  routineIds?: string | string[];
}): PlayerRoutinesPdfQuery {
  const disciplineId = firstValue(input.discipline) ?? null;
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
    routineIds,
  };
}

export function buildPlayerRoutinesPdfPath(input: {
  playerId: string;
  disciplineId?: string | null;
  routineIds: string[];
}) {
  const params = new URLSearchParams();
  if (input.disciplineId) {
    params.set("discipline", input.disciplineId);
  }
  params.set("routineIds", input.routineIds.join(","));
  return `/reports/routines/${input.playerId}/pdf?${params.toString()}`;
}
