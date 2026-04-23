import { AuthError } from "@/application/auth/auth-context";

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

    async arrayBuffer() {
      if (this.body instanceof Uint8Array) {
        return this.body.buffer.slice(
          this.body.byteOffset,
          this.body.byteOffset + this.body.byteLength
        );
      }

      const data = Buffer.from(String(this.body));
      return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    }
  }

  return {
    NextRequest: class NextRequest {},
    NextResponse: MockNextResponse,
  };
});

jest.mock("node:fs/promises", () => ({
  readFile: jest.fn(),
}));

jest.mock("@ams/db/queries/dashboard/getDashboardWeeklyReports", () => ({
  getWeeklyUsageReportById: jest.fn(),
}));

jest.mock("@/application/auth/auth-context", () => ({
  AuthError: class AuthError extends Error {
    status: number;

    constructor(status: number, message: string) {
      super(message);
      this.status = status;
    }
  },
  getAuthContext: jest.fn(),
  requireRole: jest.fn(),
  assertFacilityAccess: jest.fn(),
}));

jest.mock("@ams/application/reports/puppeteer", () => ({
  launchPdfBrowser: jest.fn(),
}));

const { readFile } = require("node:fs/promises");
const { getWeeklyUsageReportById } = require("@ams/db/queries/dashboard/getDashboardWeeklyReports");
const {
  getAuthContext,
  requireRole,
  assertFacilityAccess,
} = require("@/application/auth/auth-context");
const { launchPdfBrowser } = require("@ams/application/reports/puppeteer");
const { GET } = require("@/app/reports/weekly-usage/[reportId]/pdf/route");

describe("GET /reports/weekly-usage/[reportId]/pdf", () => {
  const pdfBuffer = Buffer.from("fake pdf");
  const close = jest.fn();
  const setContent = jest.fn();
  const pdf = jest.fn();
  const newPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (readFile as jest.Mock).mockResolvedValue("<svg />");
    (getAuthContext as jest.Mock).mockResolvedValue({
      userId: "admin-1",
      role: "admin",
      facilityId: "facility-1",
      playerId: null,
      email: "admin@example.com",
    });
    (requireRole as jest.Mock).mockReturnValue(undefined);
    (assertFacilityAccess as jest.Mock).mockReturnValue(undefined);
    (getWeeklyUsageReportById as jest.Mock).mockResolvedValue({
      id: "report-1",
      facilityId: "facility-1",
      weekStart: "2026-03-16T04:00:00.000Z",
      weekEnd: "2026-03-23T03:59:59.999Z",
      status: "complete",
      reportVersion: 1,
      generatedAt: "2026-03-23T12:00:00.000Z",
      failedAt: null,
      errorMessage: null,
      reportData: {
        version: 1,
        scope: {
          facilityId: "facility-1",
          facilityName: "5 Tool East",
        },
        range: {
          weekStart: "2026-03-16T04:00:00.000Z",
          weekEnd: "2026-03-23T03:59:59.999Z",
          label: "Mar 16, 2026 - Mar 22, 2026",
          timezone: "America/New_York",
        },
        summary: {
          activePlayers: 8,
          activeCoaches: 3,
          lessonsCreated: 18,
          newPlayersAdded: 2,
          injuriesLogged: 1,
        },
        coaches: {
          totalCoachesIncluded: 3,
          items: [],
        },
      },
    });
    setContent.mockResolvedValue(undefined);
    pdf.mockResolvedValue(pdfBuffer);
    newPage.mockResolvedValue({
      setContent,
      pdf,
    });
    close.mockResolvedValue(undefined);
    (launchPdfBrowser as jest.Mock).mockResolvedValue({
      newPage,
      close,
    });
  });

  function createRequest(url: string) {
    return {
      nextUrl: new URL(url),
    } as any;
  }

  it("returns an inline PDF response for complete reports", async () => {
    const response = await GET(createRequest("http://localhost/reports/weekly-usage/report-1/pdf"), {
      params: Promise.resolve({ reportId: "report-1" }),
    });

    expect(getAuthContext).toHaveBeenCalled();
    expect(requireRole).toHaveBeenCalledWith(expect.objectContaining({ userId: "admin-1" }), [
      "admin",
    ]);
    expect(assertFacilityAccess).toHaveBeenCalledWith(
      expect.objectContaining({ facilityId: "facility-1" }),
      "facility-1"
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toContain("inline;");
    expect(response.headers.get("Content-Disposition")).toContain(
      'weekly-usage-report-5-tool-east-mar-16-2026-mar-22-2026.pdf'
    );
    expect(close).toHaveBeenCalled();
  });

  it("returns attachment disposition when download=1", async () => {
    const response = await GET(
      createRequest("http://localhost/reports/weekly-usage/report-1/pdf?download=1"),
      {
        params: Promise.resolve({ reportId: "report-1" }),
      }
    );

    expect(response.headers.get("Content-Disposition")).toContain("attachment;");
  });

  it("returns 404 when the report is unavailable", async () => {
    (getWeeklyUsageReportById as jest.Mock).mockResolvedValue(null);

    const response = await GET(createRequest("http://localhost/reports/weekly-usage/report-1/pdf"), {
      params: Promise.resolve({ reportId: "report-1" }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: "Report unavailable" });
    expect(launchPdfBrowser).not.toHaveBeenCalled();
  });

  it("maps auth failures to auth responses", async () => {
    (assertFacilityAccess as jest.Mock).mockImplementation(() => {
      throw new AuthError(404, "Resource not found");
    });

    const response = await GET(createRequest("http://localhost/reports/weekly-usage/report-1/pdf"), {
      params: Promise.resolve({ reportId: "report-1" }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: "Resource not found" });
    expect(launchPdfBrowser).not.toHaveBeenCalled();
  });
});
