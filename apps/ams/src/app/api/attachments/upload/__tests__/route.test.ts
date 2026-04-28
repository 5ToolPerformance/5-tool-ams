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
const { POST } = require("@/app/api/attachments/upload/route");

function createApiResponse(body: unknown, init: { status: number }) {
  return {
    status: init.status,
    json: jest.fn().mockResolvedValue(body),
  };
}

function createMultipartRequest(body: Buffer) {
  return {
    url: "http://ams.test/api/attachments/upload?source=lesson",
    method: "POST",
    headers: {
      get: (name: string) =>
        name.toLowerCase() === "content-type"
          ? "multipart/form-data; boundary=----ams-test"
          : null,
    },
    arrayBuffer: async () =>
      body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength),
  } as Request;
}

describe("POST /api/attachments/upload", () => {
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
      createApiResponse({ attachment: { id: "attachment-1" } }, { status: 201 })
    );
  });

  it("forwards multipart upload content type and raw body to the signed API client", async () => {
    const multipartBody = Buffer.from("------ams-test\r\nfile-bytes\r\n------ams-test--");

    const response = await POST(createMultipartRequest(multipartBody));

    expect(fetchInternalApi).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "coach-1",
        email: "coach@example.com",
      }),
      "/api/v1/attachments/upload?source=lesson",
      expect.objectContaining({
        method: "POST",
        cache: "no-store",
        headers: expect.anything(),
        body: expect.anything(),
      })
    );

    const [, , init] = fetchInternalApi.mock.calls[0];
    expect(init.headers.get("Content-Type")).toBe(
      "multipart/form-data; boundary=----ams-test"
    );
    expect(Buffer.from(init.body).toString("utf8")).toBe(multipartBody.toString("utf8"));
    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      attachment: { id: "attachment-1" },
    });
  });

  it("passes through API error responses", async () => {
    (fetchInternalApi as jest.Mock).mockResolvedValue(
      createApiResponse({ error: "File too large" }, { status: 400 })
    );

    const response = await POST(createMultipartRequest(Buffer.from("too-large")));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "File too large" });
  });
});

export {};
