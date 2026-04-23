import {
  buildDashboardRangeWindow,
  parseDashboardRange,
} from "@/domain/dashboard/range";

describe("dashboard range", () => {
  it("defaults to 30d for invalid values", () => {
    expect(parseDashboardRange("bogus")).toBe("30d");
    expect(parseDashboardRange(undefined)).toBe("30d");
    expect(parseDashboardRange(null)).toBe("30d");
  });

  it("builds date windows for finite ranges", () => {
    const now = new Date("2026-03-02T12:00:00.000Z");
    const range7d = buildDashboardRangeWindow("7d", now);
    const range30d = buildDashboardRangeWindow("30d", now);
    const range90d = buildDashboardRangeWindow("90d", now);

    expect(range7d.startIso).toBe("2026-02-23T00:00:00.000Z");
    expect(range30d.startIso).toBe("2026-01-31T00:00:00.000Z");
    expect(range90d.startIso).toBe("2025-12-02T00:00:00.000Z");
    expect(range7d.endIso).toBe(now.toISOString());
    expect(range30d.endIso).toBe(now.toISOString());
    expect(range90d.endIso).toBe(now.toISOString());
  });

  it("supports all-time range with null start", () => {
    const now = new Date("2026-03-02T12:00:00.000Z");
    const rangeAll = buildDashboardRangeWindow("all", now);

    expect(rangeAll.startIso).toBeNull();
    expect(rangeAll.endIso).toBe(now.toISOString());
  });
});

