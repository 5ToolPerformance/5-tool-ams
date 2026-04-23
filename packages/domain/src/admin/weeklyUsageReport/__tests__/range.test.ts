import { getWeeklyUsageReportRange } from "@/domain/admin/weeklyUsageReport/range";

describe("getWeeklyUsageReportRange", () => {
  it("returns the previous Monday-Sunday week in Eastern time", () => {
    const range = getWeeklyUsageReportRange(new Date("2026-03-23T12:00:00.000Z"));

    expect(range.timezone).toBe("America/New_York");
    expect(range.weekStart.toISOString()).toBe("2026-03-16T04:00:00.000Z");
    expect(range.weekEnd.toISOString()).toBe("2026-03-23T03:59:59.999Z");
    expect(range.queryStart.toISOString()).toBe("2026-03-16T04:00:00.000Z");
    expect(range.queryEndExclusive.toISOString()).toBe("2026-03-23T04:00:00.000Z");
    expect(range.label).toBe("Mar 16, 2026 - Mar 22, 2026");
  });

  it("handles daylight savings transitions inside the report week", () => {
    const range = getWeeklyUsageReportRange(new Date("2026-03-16T12:00:00.000Z"));

    expect(range.weekStart.toISOString()).toBe("2026-03-09T04:00:00.000Z");
    expect(range.weekEnd.toISOString()).toBe("2026-03-16T03:59:59.999Z");
    expect(range.label).toBe("Mar 9, 2026 - Mar 15, 2026");
  });
});
