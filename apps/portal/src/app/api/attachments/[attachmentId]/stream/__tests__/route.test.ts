class TestHeaders {
  private readonly values = new Map<string, string>();

  constructor(init?: Record<string, string> | TestHeaders) {
    if (init instanceof TestHeaders) {
      init.values.forEach((value, key) => this.values.set(key, value));
      return;
    }

    Object.entries(init ?? {}).forEach(([key, value]) => {
      this.values.set(key.toLowerCase(), value);
    });
  }

  get(name: string) {
    return this.values.get(name.toLowerCase()) ?? null;
  }

  set(name: string, value: string) {
    this.values.set(name.toLowerCase(), value);
  }
}

class TestRequest {
  readonly url: string;
  readonly method: string;
  readonly headers: TestHeaders;

  constructor(url: string, init?: { method?: string; headers?: Record<string, string> }) {
    this.url = url;
    this.method = init?.method ?? "GET";
    this.headers = new TestHeaders(init?.headers);
  }
}

class TestResponse {
  readonly body: unknown;
  readonly status: number;
  readonly headers: TestHeaders;

  constructor(body?: unknown, init?: { status?: number; headers?: Record<string, string> | TestHeaders }) {
    this.body = body ?? null;
    this.status = init?.status ?? 200;
    this.headers = new TestHeaders(init?.headers);
  }

  async text() {
    return typeof this.body === "string" ? this.body : String(this.body ?? "");
  }

  async json() {
    return JSON.parse(await this.text());
  }
}

Object.assign(globalThis, {
  Headers: TestHeaders,
  Request: TestRequest,
  Response: TestResponse,
});

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number; headers?: Record<string, string> }) =>
      new Response(JSON.stringify(body), {
        status: init?.status ?? 200,
        headers: {
          "Content-Type": "application/json",
          ...(init?.headers ?? {}),
        },
      }),
  },
}));

jest.mock("@/application/auth/http", () => ({
  toAuthErrorResponse: jest.fn(() => null),
}));

jest.mock("@/lib/server/api-client", () => ({
  fetchInternalApi: jest.fn(),
  getPortalInternalApiActor: jest.fn(),
}));

const {
  fetchInternalApi,
  getPortalInternalApiActor,
} = require("@/lib/server/api-client");
const { GET } = require("@/app/api/attachments/[attachmentId]/stream/route");

function createRequest(headers?: Record<string, string>) {
  return new Request("http://portal.test/api/attachments/attachment-1/stream", {
    headers,
  });
}

function createContext(attachmentId = "attachment-1") {
  return {
    params: Promise.resolve({ attachmentId }),
  };
}

describe("GET /api/attachments/[attachmentId]/stream", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getPortalInternalApiActor as jest.Mock).mockResolvedValue({
      userId: "client-1",
      email: "client@example.com",
    });
  });

  it("streams the API response through portal and preserves file headers", async () => {
    (fetchInternalApi as jest.Mock).mockResolvedValue(
      new Response("pdf-bytes", {
        status: 206,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Length": "9",
          "Content-Disposition": 'inline; filename="report.pdf"',
          "Cache-Control": "no-store",
          "Accept-Ranges": "bytes",
          "Content-Range": "bytes 0-8/9",
        },
      })
    );

    const response = await GET(
      createRequest({ Range: "bytes=0-8" }),
      createContext()
    );

    expect(fetchInternalApi).toHaveBeenCalledWith(
      {
        userId: "client-1",
        email: "client@example.com",
      },
      "/api/v1/attachments/attachment-1/stream",
      expect.objectContaining({
        method: "GET",
        cache: "no-store",
        headers: expect.anything(),
      })
    );

    const [, , init] = fetchInternalApi.mock.calls[0];
    expect(init.headers.get("Range")).toBe("bytes=0-8");
    expect(response.status).toBe(206);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Length")).toBe("9");
    expect(response.headers.get("Content-Disposition")).toBe(
      'inline; filename="report.pdf"'
    );
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("Accept-Ranges")).toBe("bytes");
    expect(response.headers.get("Content-Range")).toBe("bytes 0-8/9");
    await expect(response.text()).resolves.toBe("pdf-bytes");
  });

  it("passes through API error responses without exposing internal auth", async () => {
    (fetchInternalApi as jest.Mock).mockResolvedValue(
      new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      })
    );

    const response = await GET(createRequest(), createContext());

    expect(response.status).toBe(401);
    expect(response.headers.get("Authorization")).toBeNull();
    expect(response.headers.get("Content-Type")).toBe("application/json");
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });
});

export {};
