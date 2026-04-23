jest.mock("next/server", () => {
  class MockHeaders {
    private readonly values = new Map<string, string>();

    constructor(init?: Record<string, string>) {
      Object.entries(init ?? {}).forEach(([key, value]) => {
        this.values.set(key.toLowerCase(), value);
      });
    }

    get(name: string) {
      return this.values.get(name.toLowerCase()) ?? null;
    }
  }

  class MockNextResponse {
    status: number;
    headers: MockHeaders;
    private readonly body: unknown;

    constructor(body: unknown, init?: { status?: number; headers?: Record<string, string> }) {
      this.body = body;
      this.status = init?.status ?? 200;
      this.headers = new MockHeaders(init?.headers);
    }

    static json(body: unknown, init?: { status?: number; headers?: Record<string, string> }) {
      return new MockNextResponse(body, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(init?.headers ?? {}),
        },
      });
    }

    async json() {
      return this.body;
    }
  }

  return {
    NextResponse: MockNextResponse,
  };
});

jest.mock("@/application/admin/weeklyUsageReport/generateWeeklyUsageReports", () => ({
  generateWeeklyUsageReportForFacility: jest.fn(),
}));

jest.mock("@/application/auth/auth-context", () => ({
  getAuthContext: jest.fn(),
  requireRole: jest.fn(),
}));

jest.mock("@/application/auth/http", () => ({
  toAuthErrorResponse: jest.fn(() => null),
}));

const {
  generateWeeklyUsageReportForFacility,
} = require("@/application/admin/weeklyUsageReport/generateWeeklyUsageReports");
const { getAuthContext, requireRole } = require("@/application/auth/auth-context");
const { POST } = require("@/app/api/admin/weekly-usage-reports/route");

describe("POST /api/admin/weekly-usage-reports", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (getAuthContext as jest.Mock).mockResolvedValue({
      userId: "admin-1",
      role: "admin",
      facilityId: "facility-1",
      playerId: null,
      email: "admin@example.com",
    });
  });

  it("generates the previous week report for the current admin facility", async () => {
    (generateWeeklyUsageReportForFacility as jest.Mock).mockResolvedValue({
      facilityId: "facility-1",
      facilityName: "5 Tool East",
      weekStart: "2026-03-16T04:00:00.000Z",
      weekEnd: "2026-03-23T03:59:59.999Z",
      label: "Mar 16, 2026 - Mar 22, 2026",
    });

    const response = await POST();

    expect(requireRole).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "admin-1" }),
      ["admin"]
    );
    expect(generateWeeklyUsageReportForFacility).toHaveBeenCalledWith("facility-1", {
      generatedByUserId: "admin-1",
    });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        success: true,
        result: expect.objectContaining({
          label: "Mar 16, 2026 - Mar 22, 2026",
        }),
      })
    );
  });
});
