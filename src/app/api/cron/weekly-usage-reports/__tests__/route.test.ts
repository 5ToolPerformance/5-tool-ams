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
    NextRequest: class NextRequest {},
    NextResponse: MockNextResponse,
  };
});

jest.mock("@/application/admin/weeklyUsageReport/generateWeeklyUsageReports", () => ({
  generateWeeklyUsageReports: jest.fn(),
}));

jest.mock("@/env/server", () => ({
  env: {
    CRON_SECRET: "top-secret",
  },
}));

const { generateWeeklyUsageReports } = require("@/application/admin/weeklyUsageReport/generateWeeklyUsageReports");
const { GET } = require("@/app/api/cron/weekly-usage-reports/route");

describe("GET /api/cron/weekly-usage-reports", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects unauthorized requests", async () => {
    const response = await GET({
      headers: {
        get: () => null,
      },
    } as any);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
    expect(generateWeeklyUsageReports).not.toHaveBeenCalled();
  });

  it("returns the cron result payload", async () => {
    (generateWeeklyUsageReports as jest.Mock).mockResolvedValue({
      processedFacilities: 2,
      successfulFacilities: 2,
      failedFacilities: 0,
      weekStart: "2026-03-16T04:00:00.000Z",
      weekEnd: "2026-03-23T03:59:59.999Z",
      failures: [],
    });

    const response = await GET({
      headers: {
        get: () => "Bearer top-secret",
      },
    } as any);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        success: true,
        result: expect.objectContaining({
          processedFacilities: 2,
          successfulFacilities: 2,
        }),
      })
    );
  });
});
