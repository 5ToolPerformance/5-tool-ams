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
      const data =
        this.body instanceof Uint8Array
          ? this.body
          : Buffer.from(typeof this.body === "string" ? this.body : JSON.stringify(this.body));

      return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    }
  }

  return {
    NextResponse: MockNextResponse,
  };
});

jest.mock("node:fs/promises", () => ({
  readFile: jest.fn(),
}));

jest.mock("@ams/application/routines/getUniversalRoutinePdfData", () => ({
  getUniversalRoutinePdfData: jest.fn(),
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
  assertCanReadUniversalRoutine: jest.fn(),
}));

jest.mock("@ams/application/reports/puppeteer", () => ({
  launchPdfBrowser: jest.fn(),
}));

const { readFile } = require("node:fs/promises");
const {
  getUniversalRoutinePdfData,
} = require("@ams/application/routines/getUniversalRoutinePdfData");
const {
  getAuthContext,
  assertCanReadUniversalRoutine,
} = require("@/application/auth/auth-context");
const { launchPdfBrowser } = require("@ams/application/reports/puppeteer");
const { GET } = require("@/app/reports/universal-routines/[routineId]/pdf/route");

describe("GET /reports/universal-routines/[routineId]/pdf", () => {
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
    (assertCanReadUniversalRoutine as jest.Mock).mockResolvedValue(undefined);
    (getUniversalRoutinePdfData as jest.Mock).mockResolvedValue({
      generatedOn: new Date("2026-03-20"),
      routine: {
        id: "routine-1",
        title: "Direction Reset",
        description: "Reset timing.",
        routineType: "partial_lesson",
        createdByName: "Coach Lane",
        discipline: {
          id: "disc-1",
          key: "pitching",
          label: "Pitching",
        },
        summary: "Keep direction clean.",
        usageNotes: "Use before bullpen work.",
        mechanics: ["Lead-leg direction"],
        blocks: [],
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

  it("returns an inline PDF response for a universal routine", async () => {
    const response = await GET({} as Request, {
      params: Promise.resolve({ routineId: "routine-1" }),
    });

    expect(assertCanReadUniversalRoutine).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "coach-1" }),
      "routine-1"
    );
    expect(getUniversalRoutinePdfData).toHaveBeenCalledWith("routine-1");
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toContain(
      'universal-routine-direction-reset-pitching.pdf'
    );
  });

  it("returns 404 when the export data is unavailable", async () => {
    (getUniversalRoutinePdfData as jest.Mock).mockResolvedValue(null);

    const response = await GET({} as Request, {
      params: Promise.resolve({ routineId: "routine-1" }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "Routine export unavailable",
    });
  });

  it("maps auth failures to an auth response", async () => {
    (assertCanReadUniversalRoutine as jest.Mock).mockRejectedValue(
      new AuthError(403, "Forbidden")
    );

    const response = await GET({} as Request, {
      params: Promise.resolve({ routineId: "routine-1" }),
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error: "Forbidden",
    });
  });
});
