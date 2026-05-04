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
const { toAuthErrorResponse } = require("@/application/auth/http");
const { fetchInternalApi } = require("@/lib/server/api-client");
const playersRoute = require("@/app/api/players/route");
const playerRoute = require("@/app/api/players/[id]/route");

function createApiResponse(body: unknown, init: { status: number }) {
  return {
    status: init.status,
    json: jest.fn().mockResolvedValue(body),
  };
}

function createJsonRequest(path: string, method: string, body: unknown) {
  const payload = Buffer.from(JSON.stringify(body));

  return {
    url: `http://ams.test${path}`,
    method,
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

function createAuthResponse(status: number, body: unknown) {
  return {
    status,
    headers: { get: () => null },
    json: jest.fn().mockResolvedValue(body),
  };
}

describe("AMS player mutation routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (toAuthErrorResponse as jest.Mock).mockReturnValue(null);
    (getAuthContext as jest.Mock).mockResolvedValue({
      userId: "coach-1",
      role: "coach",
      facilityId: "facility-1",
      playerId: null,
      email: "coach@example.com",
      access: "read/write",
      systemRole: "standard",
    });
  });

  it("proxies player creation through the signed internal API client", async () => {
    const requestBody = {
      firstName: "Jane",
      lastName: "Player",
      date_of_birth: "2010-01-01",
      sport: "softball",
      height: 64,
      weight: 120,
      throws: "right",
      hits: "left",
      primaryCoachId: "coach-1",
      primaryPositionId: "position-1",
      secondaryPositionIds: ["position-2"],
    };
    (fetchInternalApi as jest.Mock).mockResolvedValue(
      createApiResponse(
        {
          success: true,
          data: { id: "player-1" },
          message: "Player created successfully",
        },
        { status: 200 }
      )
    );

    const response = await playersRoute.POST(
      createJsonRequest("/api/players", "POST", requestBody)
    );

    expect(fetchInternalApi).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "coach-1",
        email: "coach@example.com",
      }),
      "/api/v1/players",
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
      data: { id: "player-1" },
      message: "Player created successfully",
    });
  });

  it("proxies player updates through the signed internal API client", async () => {
    const requestBody = {
      firstName: "Jane",
      primaryPositionId: "position-1",
      secondaryPositionIds: [],
    };
    (fetchInternalApi as jest.Mock).mockResolvedValue(
      createApiResponse(
        {
          success: true,
          message: "Player updated successfully",
        },
        { status: 200 }
      )
    );

    const response = await playerRoute.PATCH(
      createJsonRequest("/api/players/player-1", "PATCH", requestBody),
      { params: Promise.resolve({ id: "player-1" }) }
    );

    expect(fetchInternalApi).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "coach-1",
        email: "coach@example.com",
      }),
      "/api/v1/players/player-1",
      expect.objectContaining({
        method: "PATCH",
        cache: "no-store",
        headers: expect.anything(),
        body: expect.anything(),
      })
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      message: "Player updated successfully",
    });
  });

  it("passes through API validation errors", async () => {
    (fetchInternalApi as jest.Mock).mockResolvedValue(
      createApiResponse(
        {
          success: false,
          error: "Primary position is required",
        },
        { status: 400 }
      )
    );

    const response = await playersRoute.POST(
      createJsonRequest("/api/players", "POST", {})
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "Primary position is required",
    });
  });

  it("returns auth errors before calling the internal API", async () => {
    const authResponse = createAuthResponse(403, { error: "Forbidden" });
    (getAuthContext as jest.Mock).mockRejectedValue(new Error("Forbidden"));
    (toAuthErrorResponse as jest.Mock).mockReturnValue(authResponse);

    const response = await playersRoute.POST(
      createJsonRequest("/api/players", "POST", {})
    );

    expect(fetchInternalApi).not.toHaveBeenCalled();
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "Forbidden" });
  });
});

export {};
