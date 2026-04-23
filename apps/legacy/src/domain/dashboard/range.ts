import { DashboardRangeKey, DashboardRangeWindow } from "@/domain/dashboard/types";

const VALID_RANGES = new Set<DashboardRangeKey>(["7d", "30d", "90d", "all"]);

function daysForRange(range: DashboardRangeKey): number | null {
  if (range === "7d") return 7;
  if (range === "30d") return 30;
  if (range === "90d") return 90;
  return null;
}

export function parseDashboardRange(value: string | null | undefined): DashboardRangeKey {
  if (!value) return "30d";
  return VALID_RANGES.has(value as DashboardRangeKey)
    ? (value as DashboardRangeKey)
    : "30d";
}

export function buildDashboardRangeWindow(
  key: DashboardRangeKey,
  now = new Date()
): DashboardRangeWindow {
  const end = new Date(now);
  const days = daysForRange(key);

  if (days === null) {
    return {
      key,
      startIso: null,
      endIso: end.toISOString(),
    };
  }

  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - days);
  start.setUTCHours(0, 0, 0, 0);

  return {
    key,
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  };
}

export function getDashboardRangeWindow(
  value: string | null | undefined,
  now = new Date()
) {
  const key = parseDashboardRange(value);
  return buildDashboardRangeWindow(key, now);
}
