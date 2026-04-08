import { AuthError } from "@/lib/auth/auth-context";

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
    NextRequest: class NextRequest {},
    NextResponse: MockNextResponse,
  };
});

jest.mock("node:fs/promises", () => ({
  readFile: jest.fn(),
}));

jest.mock("@/application/players/development/getPlayerRoutinesPdfData", () => ({
  getPlayerRoutinesPdfData: jest.fn(),
}));

jest.mock("@/lib/auth/auth-context", () => ({
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

jest.mock("@/lib/reports/puppeteer", () => ({
  launchPdfBrowser: jest.fn(),
}));

const { readFile } = require("node:fs/promises");
const {
  getPlayerRoutinesPdfData,
} = require("@/application/players/development/getPlayerRoutinesPdfData");
const { getAuthContext, assertPlayerAccess } = require("@/lib/auth/auth-context");
const { launchPdfBrowser } = require("@/lib/reports/puppeteer");
const { GET } = require("@/app/reports/routines/[playerId]/pdf/route");

describe("GET /reports/routines/[playerId]/pdf", () => {
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
    (getPlayerRoutinesPdfData as jest.Mock).mockResolvedValue({
      player: {
        id: "player-1",
        name: "Ava Stone",
        primaryCoachName: "Coach Lane",
      },
      discipline: {
        id: "disc-1",
        key: "pitching",
        label: "Pitching",
      },
      generatedOn: new Date("2026-03-20"),
      routines: [
        {
          id: "routine-1",
          title: "Direction Reset",
          description: "Reset timing.",
          routineType: "partial_lesson",
          summary: "Keep direction clean.",
          usageNotes: "Use before bullpen work.",
          mechanics: ["Lead-leg direction"],
          blocks: [],
        },
      ],
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

  it("returns an inline PDF response for selected routines", async () => {
    const response = await GET(
      createRequest(
        "http://localhost/reports/routines/player-1/pdf?discipline=disc-1&routineIds=routine-1"
      ),
      { params: Promise.resolve({ playerId: "player-1" }) }
    );

    expect(assertPlayerAccess).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "coach-1" }),
      "player-1"
    );
    expect(getPlayerRoutinesPdfData).toHaveBeenCalledWith({
      playerId: "player-1",
      disciplineId: "disc-1",
      routineIds: ["routine-1"],
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toContain(
      'player-routines-ava-stone-pitching.pdf'
    );
  });

  it("returns 400 when discipline is missing", async () => {
    const response = await GET(
      createRequest("http://localhost/reports/routines/player-1/pdf?routineIds=routine-1"),
      { params: Promise.resolve({ playerId: "player-1" }) }
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "discipline is required",
    });
  });

  it("returns 400 when no routines are selected", async () => {
    const response = await GET(
      createRequest("http://localhost/reports/routines/player-1/pdf?discipline=disc-1"),
      { params: Promise.resolve({ playerId: "player-1" }) }
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "At least one routine must be selected.",
    });
  });

  it("returns 404 when the export data is unavailable", async () => {
    (getPlayerRoutinesPdfData as jest.Mock).mockResolvedValue(null);

    const response = await GET(
      createRequest(
        "http://localhost/reports/routines/player-1/pdf?discipline=disc-1&routineIds=routine-1"
      ),
      { params: Promise.resolve({ playerId: "player-1" }) }
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "Routine export unavailable",
    });
  });

  it("maps auth failures to an auth response", async () => {
    (assertPlayerAccess as jest.Mock).mockRejectedValue(
      new AuthError(403, "Forbidden")
    );

    const response = await GET(
      createRequest(
        "http://localhost/reports/routines/player-1/pdf?discipline=disc-1&routineIds=routine-1"
      ),
      { params: Promise.resolve({ playerId: "player-1" }) }
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({
      error: "Forbidden",
    });
  });
});
