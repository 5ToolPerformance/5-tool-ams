import {
  assertPortalInviteUserIsExternal,
  resolveClientInviteStatus,
  resolveSelectedPortalPlayerId,
} from "@/application/client-portal/helpers";

describe("client portal service helpers", () => {
  it("prefers the requested player when it is accessible", () => {
    expect(
      resolveSelectedPortalPlayerId(["player-1", "player-2"], "player-2")
    ).toBe("player-2");
  });

  it("falls back to the first player when requested player is not accessible", () => {
    expect(
      resolveSelectedPortalPlayerId(["player-1", "player-2"], "player-9")
    ).toBe("player-1");
  });

  it("marks pending invites as expired when the expiry has passed", () => {
    expect(
      resolveClientInviteStatus(
        "pending",
        new Date("2026-03-01T00:00:00.000Z"),
        new Date("2026-03-02T00:00:00.000Z")
      )
    ).toBe("expired");
  });

  it("rejects internal users from accepting portal invites", () => {
    expect(() => assertPortalInviteUserIsExternal("admin")).toThrow(
      "Internal users cannot accept client portal invites"
    );
  });
});
