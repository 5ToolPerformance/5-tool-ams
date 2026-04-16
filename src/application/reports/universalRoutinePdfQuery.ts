export function buildUniversalRoutinePdfPath(input: { routineId: string }) {
  return `/reports/universal-routines/${input.routineId}/pdf`;
}
