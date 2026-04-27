import {
  createInternalApiToken,
  verifyInternalApiToken,
} from "@ams/auth/internal-api-token";

const secret = "test-internal-api-secret-with-32-chars";
const now = new Date("2026-04-27T12:00:00.000Z");

describe("internal API tokens", () => {
  it("verifies a token signed by an allowed app for the api audience", () => {
    const token = createInternalApiToken({
      secret,
      issuer: "ams",
      audience: "api",
      userId: "user_123",
      email: "coach@example.com",
      now,
    });

    expect(
      verifyInternalApiToken({
        token,
        secret,
        expectedIssuer: "ams",
        expectedAudience: "api",
        now,
      })
    ).toMatchObject({
      iss: "ams",
      aud: "api",
      sub: "user_123",
      email: "coach@example.com",
    });
  });

  it("rejects tampered token payloads", () => {
    const token = createInternalApiToken({
      secret,
      issuer: "portal",
      audience: "api",
      userId: "user_123",
      now,
    });

    const [payload, signature] = token.split(".");
    const tamperedPayload = Buffer.from(
      JSON.stringify({
        v: 1,
        iss: "portal",
        aud: "api",
        sub: "attacker",
        iat: Math.floor(now.getTime() / 1000),
        exp: Math.floor(now.getTime() / 1000) + 300,
      }),
      "utf8"
    ).toString("base64url");

    expect(
      verifyInternalApiToken({
        token: `${tamperedPayload}.${signature}`,
        secret,
        expectedIssuer: "portal",
        expectedAudience: "api",
        now,
      })
    ).toBeNull();
    expect(payload).toBeTruthy();
  });

  it("rejects expired tokens and wrong audiences", () => {
    const token = createInternalApiToken({
      secret,
      issuer: "ams",
      audience: "api",
      userId: "user_123",
      ttlSeconds: 60,
      now,
    });

    expect(
      verifyInternalApiToken({
        token,
        secret,
        expectedIssuer: "ams",
        expectedAudience: "portal",
        now,
      })
    ).toBeNull();

    expect(
      verifyInternalApiToken({
        token,
        secret,
        expectedIssuer: "ams",
        expectedAudience: "api",
        now: new Date("2026-04-27T12:02:00.000Z"),
      })
    ).toBeNull();
  });
});
