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
  toAuthErrorResponse: jest.fn((error) => {
    if (error instanceof Error && "status" in error) {
      const { NextResponse } = require("next/server");
      return NextResponse.json(
        { error: error.message },
        { status: (error as Error & { status: number }).status }
      );
    }

    return null;
  }),
}));

jest.mock("@/lib/server/api-client", () => ({
  fetchInternalApi: jest.fn(),
}));

const { getAuthContext } = require("@/application/auth/auth-context");
const { fetchInternalApi } = require("@/lib/server/api-client");
const { GET } = require("@/app/api/injury-taxonomy/route");

export {};

describe("GET /api/injury-taxonomy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAuthContext as jest.Mock).mockResolvedValue({
      userId: "user-1",
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
          bodyParts: [{ id: "shoulder", name: "Shoulder" }],
          focusAreas: [{ id: "mobility", name: "Mobility" }],
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

  it("proxies the taxonomy read through signed server-side API access", async () => {
    const response = await GET();

    expect(fetchInternalApi).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        email: "coach@example.com",
      }),
      "/api/v1/injury-taxonomy",
      {
        method: "GET",
        cache: "no-store",
      }
    );
    await expect(response.json()).resolves.toEqual({
      bodyParts: [{ id: "shoulder", name: "Shoulder" }],
      focusAreas: [{ id: "mobility", name: "Mobility" }],
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("Authorization")).toBeNull();
  });

  it("returns auth failures without calling the API", async () => {
    const error = new Error("Unauthorized") as Error & { status: number };
    error.status = 401;
    (getAuthContext as jest.Mock).mockRejectedValue(error);

    const response = await GET();

    expect(fetchInternalApi).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });
});
