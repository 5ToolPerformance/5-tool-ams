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

jest.mock("@/application/auth/auth-context", () => ({
  getAuthContext: jest.fn(),
}));

jest.mock("@/application/auth/http", () => ({
  toAuthErrorResponse: jest.fn(() => null),
}));

jest.mock("@/lib/server/api-client", () => ({
  fetchInternalApi: jest.fn(),
}));

const { getAuthContext } = require("@/application/auth/auth-context");
const { fetchInternalApi } = require("@/lib/server/api-client");
const { POST } = require("@/app/api/evaluations/route");

describe("POST /api/evaluations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAuthContext as jest.Mock).mockResolvedValue({
      userId: "coach-1",
      role: "coach",
      facilityId: "facility-1",
      playerId: null,
      email: "coach@example.com",
      access: "read/write",
      systemRole: "standard",
    });
    (fetchInternalApi as jest.Mock).mockResolvedValue(
      createApiResponse({ id: "evaluation-1" }, { status: 201 })
    );
  });

  function createApiResponse(body: unknown, init: { status: number }) {
    return {
      status: init.status,
      json: jest.fn().mockResolvedValue(body),
    };
  }

  function createJsonRequest(body: unknown) {
    const payload = Buffer.from(JSON.stringify(body));

    return {
      url: "http://ams.test/api/evaluations",
      method: "POST",
      headers: {
        get: (name: string) =>
          name.toLowerCase() === "content-type" ? "application/json" : null,
      },
      arrayBuffer: async () =>
        payload.buffer.slice(
          payload.byteOffset,
          payload.byteOffset + payload.byteLength
        ),
    } as Request;
  }

  it("forwards evaluation creation method, content type, and body to the signed API client", async () => {
    const requestBody = {
      playerId: "player-1",
      disciplineId: "discipline-1",
      evaluationDate: "2026-04-27T12:00:00.000Z",
      documentData: { buckets: [] },
    };

    const response = await POST(createJsonRequest(requestBody));

    expect(fetchInternalApi).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "coach-1",
        email: "coach@example.com",
      }),
      "/api/v1/evaluations",
      expect.objectContaining({
        method: "POST",
        cache: "no-store",
        headers: expect.anything(),
        body: expect.anything(),
      })
    );

    const [, , init] = fetchInternalApi.mock.calls[0];
    expect(init.headers.get("Content-Type")).toBe("application/json");
    expect(Buffer.from(init.body).toString("utf8")).toBe(JSON.stringify(requestBody));
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ id: "evaluation-1" });
  });

  it("passes through API error responses", async () => {
    (fetchInternalApi as jest.Mock).mockResolvedValue(
      createApiResponse({ error: "Evaluation date is invalid." }, { status: 400 })
    );

    const response = await POST(createJsonRequest({}));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Evaluation date is invalid.",
    });
  });
});

export {};
