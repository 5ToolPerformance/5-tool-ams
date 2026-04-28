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

jest.mock("@/lib/server/api-client", () => ({
  fetchInternalApi: jest.fn(),
  getPortalInternalApiActor: jest.fn(),
}));

const { fetchInternalApi, getPortalInternalApiActor } = require("@/lib/server/api-client");
const { GET } = require("@/app/api/positions/route");

export {};

describe("GET /api/positions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getPortalInternalApiActor as jest.Mock).mockResolvedValue({
      userId: "client-1",
      email: "client@example.com",
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

  it("proxies positions through the portal server without exposing the internal token", async () => {
    const response = await GET();

    expect(getPortalInternalApiActor).toHaveBeenCalled();
    expect(fetchInternalApi).toHaveBeenCalledWith(
      {
        userId: "client-1",
        email: "client@example.com",
      },
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
      createApiResponse({ error: "Forbidden" }, { status: 403 })
    );

    const response = await GET();

    await expect(response.json()).resolves.toEqual({ error: "Forbidden" });
    expect(response.status).toBe(403);
  });
});
