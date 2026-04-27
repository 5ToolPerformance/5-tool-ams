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

jest.mock("@/lib/server/api-client", () => ({
  fetchInternalApi: jest.fn(),
}));

const { getAuthContext } = require("@/application/auth/auth-context");
const { fetchInternalApi } = require("@/lib/server/api-client");
const { GET } = require("@/app/api/positions/route");

export {};

describe("GET /api/positions", () => {
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
      createApiResponse([{ id: "pos-1", name: "Pitcher" }], {
        status: 200,
      })
    );
  });

  function createApiResponse(body: unknown, init: { status: number }) {
    return {
      status: init.status,
      json: jest.fn().mockResolvedValue(body),
    };
  }

  it("proxies positions through AMS without returning the internal token", async () => {
    const response = await GET();

    expect(getAuthContext).toHaveBeenCalled();
    expect(fetchInternalApi).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        email: "coach@example.com",
      }),
      "/api/v1/positions",
      {
        method: "GET",
        cache: "no-store",
      }
    );
    await expect(response.json()).resolves.toEqual([
      { id: "pos-1", name: "Pitcher" },
    ]);
    expect(response.headers.get("Authorization")).toBeNull();
    expect(response.status).toBe(200);
  });

  it("preserves API error response shape and status", async () => {
    (fetchInternalApi as jest.Mock).mockResolvedValue(
      createApiResponse({ error: "Unauthorized" }, { status: 401 })
    );

    const response = await GET();

    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
    expect(response.status).toBe(401);
  });
});
