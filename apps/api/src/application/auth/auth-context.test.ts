jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("./auth-queries", () => ({
  authContextQueries: {},
}));

import { AuthError, requireApiIssuer } from "./auth-context";

describe("API issuer boundaries", () => {
  it("allows explicitly permitted issuers", () => {
    expect(() => requireApiIssuer({ issuer: "ams" }, ["ams"])).not.toThrow();
    expect(() =>
      requireApiIssuer({ issuer: "portal" }, ["portal"])
    ).not.toThrow();
  });

  it("rejects missing and disallowed issuers", () => {
    expect(() => requireApiIssuer({ issuer: null }, ["ams"])).toThrow(
      AuthError
    );
    expect(() => requireApiIssuer({ issuer: "portal" }, ["ams"])).toThrow(
      AuthError
    );
    expect(() => requireApiIssuer({ issuer: "ams" }, ["portal"])).toThrow(
      AuthError
    );
  });
});
