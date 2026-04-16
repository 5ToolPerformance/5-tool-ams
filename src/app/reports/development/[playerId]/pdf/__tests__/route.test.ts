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

      if (typeof this.body === "string") {
        const data = Buffer.from(this.body);
        return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
      }

      const data = Buffer.from(JSON.stringify(this.body));
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

jest.mock("@/application/players/development", () => ({
  getDevelopmentReportData: jest.fn(),
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
  assertPlayerAccess: jest.fn(),
}));

jest.mock("@/application/reports/puppeteer", () => ({
  launchPdfBrowser: jest.fn(),
}));

const { readFile } = require("node:fs/promises");
const { getDevelopmentReportData } = require("@/application/players/development");
const { getAuthContext, assertPlayerAccess } = require("@/application/auth/auth-context");
const { launchPdfBrowser } = require("@/application/reports/puppeteer");
const { GET } = require("@/app/reports/development/[playerId]/pdf/route");

describe("GET /reports/development/[playerId]/pdf", () => {
  const pdfBuffer = Buffer.from("fake pdf");
  const close = jest.fn();
  const setContent = jest.fn();
  const pdf = jest.fn();
  const newPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (readFile as jest.Mock).mockResolvedValue("<svg />");
    (getAuthContext as jest.Mock).mockResolvedValue({
      userId: "coach-1",
      role: "coach",
      facilityId: "facility-1",
      playerId: null,
      email: "coach@example.com",
    });
    (assertPlayerAccess as jest.Mock).mockResolvedValue(undefined);
    (getDevelopmentReportData as jest.Mock).mockResolvedValue({
      player: {
        id: "player-1",
        name: "Ava Stone",
        age: 15,
        positions: ["Pitcher"],
        handedness: { bat: "right", throw: "left" },
        primaryCoachName: "Coach Lane",
      },
      discipline: {
        id: "disc-1",
        key: "pitching",
        label: "Pitching",
      },
      generatedOn: new Date("2026-03-20"),
      evaluation: {
        id: "eval-1",
        date: new Date("2026-03-01"),
        type: "monthly",
        phase: "preseason",
        snapshotSummary: "Snapshot",
        strengthProfileSummary: "Strength",
        keyConstraintsSummary: "Constraint",
        strengths: ["Strength 1"],
        focusAreas: [],
        constraints: ["Constraint 1"],
        evidence: [],
      },
      plan: {
        id: "plan-1",
        status: "active",
        startDate: new Date("2026-03-02"),
        targetEndDate: new Date("2026-05-01"),
        summary: "Plan summary",
        currentPriority: "Current priority",
        shortTermGoals: [],
        longTermGoals: [],
        focusAreas: [],
        measurableIndicators: [],
      },
      routines: [],
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

  it("returns an inline PDF response and enforces player access", async () => {
    const response = await GET(
      createRequest(
        "http://localhost/reports/development/player-1/pdf?discipline=disc-1&includeEvidence=1&routineIds=routine-1"
      ),
      { params: Promise.resolve({ playerId: "player-1" }) }
    );

    expect(getAuthContext).toHaveBeenCalled();
    expect(assertPlayerAccess).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "coach-1" }),
      "player-1"
    );
    expect(getDevelopmentReportData).toHaveBeenCalledWith({
      playerId: "player-1",
      disciplineId: "disc-1",
      includeEvidence: true,
      routineIds: ["routine-1"],
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toContain("inline;");
    expect(response.headers.get("Content-Disposition")).toContain(
      'development-report-ava-stone-pitching.pdf'
    );
    await expect(response.arrayBuffer()).resolves.toEqual(pdfBuffer.buffer.slice(
      pdfBuffer.byteOffset,
      pdfBuffer.byteOffset + pdfBuffer.byteLength
    ));
    expect(close).toHaveBeenCalled();
  });

  it("returns 400 when discipline is missing", async () => {
    const response = await GET(
      createRequest("http://localhost/reports/development/player-1/pdf"),
      { params: Promise.resolve({ playerId: "player-1" }) }
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "discipline is required",
    });
    expect(getDevelopmentReportData).not.toHaveBeenCalled();
    expect(launchPdfBrowser).not.toHaveBeenCalled();
  });

  it("returns 404 when the report is unavailable", async () => {
    (getDevelopmentReportData as jest.Mock).mockResolvedValue(null);

    const response = await GET(
      createRequest(
        "http://localhost/reports/development/player-1/pdf?discipline=disc-1"
      ),
      { params: Promise.resolve({ playerId: "player-1" }) }
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "Report unavailable",
    });
    expect(launchPdfBrowser).not.toHaveBeenCalled();
  });

  it("maps auth failures to an auth response", async () => {
    (assertPlayerAccess as jest.Mock).mockRejectedValue(
      new AuthError(403, "Forbidden")
    );

    const response = await GET(
      createRequest(
        "http://localhost/reports/development/player-1/pdf?discipline=disc-1"
      ),
      { params: Promise.resolve({ playerId: "player-1" }) }
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error: "Forbidden",
    });
    expect(launchPdfBrowser).not.toHaveBeenCalled();
  });
});
