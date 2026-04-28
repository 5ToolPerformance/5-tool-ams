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
const { POST } = require("@/app/api/lessons/route");

describe("POST /api/lessons", () => {
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
      createApiResponse(
        {
          success: true,
          data: { id: "lesson-1" },
          message: "Lesson created successfully",
        },
        { status: 200 }
      )
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
      url: "http://ams.test/api/lessons",
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

  it("forwards lesson creation method, content type, and body to the signed API client", async () => {
    const requestBody = {
      playerId: "player-1",
      coachId: "coach-1",
      lessonType: "hitting",
    };

    const response = await POST(createJsonRequest(requestBody));

    expect(fetchInternalApi).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "coach-1",
        email: "coach@example.com",
      }),
      "/api/v1/lessons",
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
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: { id: "lesson-1" },
      message: "Lesson created successfully",
    });
  });

  it("passes through API error responses", async () => {
    (fetchInternalApi as jest.Mock).mockResolvedValue(
      createApiResponse(
        {
          success: false,
          error: "Validation failed",
        },
        { status: 400 }
      )
    );

    const response = await POST(createJsonRequest({}));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "Validation failed",
    });
  });
});

export {};
