import { verifyInternalApiToken } from "@ams/auth/internal-api-token";

jest.mock("@/env/server", () => ({
  env: {
    API_BASE_URL: "http://api.test",
    API_INTERNAL_AUTH_SECRET: "test-internal-api-secret-with-32-chars",
  },
}));

const { fetchInternalApi } = require("@/lib/server/api-client");

describe("AMS internal API client", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    global.fetch = fetchMock;
    fetchMock.mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    fetchMock.mockReset();
  });

  it("signs API requests server-side with a short-lived internal bearer token", async () => {
    await fetchInternalApi(
      { userId: "user-1", email: "coach@example.com" },
      "/api/v1/positions"
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "http://api.test/api/v1/positions",
      expect.objectContaining({
        headers: expect.any(Headers),
      })
    );

    const [, init] = fetchMock.mock.calls[0];
    const authorization = (init?.headers as Headers).get("Authorization");
    expect(authorization).toMatch(/^Bearer /);

    const payload = verifyInternalApiToken({
      token: authorization?.slice("Bearer ".length) ?? "",
      secret: "test-internal-api-secret-with-32-chars",
      expectedIssuer: "ams",
      expectedAudience: "api",
    });

    expect(payload).toMatchObject({
      iss: "ams",
      aud: "api",
      sub: "user-1",
      email: "coach@example.com",
    });
    expect(payload?.exp).toBeGreaterThan(payload?.iat ?? 0);
  });
});
