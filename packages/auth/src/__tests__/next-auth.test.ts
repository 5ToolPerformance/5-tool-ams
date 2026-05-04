import type { AuthSessionQueries } from "../next-auth";
import {
  clearActorTokenClaims,
  loadAuthSessionState,
  loadAuthSessionStateSafely,
} from "../next-auth";

function createQueries(
  overrides: Partial<AuthSessionQueries> = {}
): AuthSessionQueries {
  return {
    findActorIdentity: jest.fn(async () => ({
      id: "user-1",
      email: "coach@example.com",
      systemRole: "standard",
      role: "coach",
      access: "read/write",
      isActive: true,
      facilityId: "facility-1",
    })),
    listMemberships: jest.fn(async () => [
      {
        facilityId: "facility-1",
        role: "coach",
        access: "read/write",
        isActive: true,
      },
    ]),
    findPlayerIdByUserId: jest.fn(async () => null),
    ...overrides,
  };
}

describe("next-auth session state helpers", () => {
  it("loads actor state for a valid user", async () => {
    const state = await loadAuthSessionState("user-1", createQueries());

    expect(state).toEqual({
      actor: {
        userId: "user-1",
        email: "coach@example.com",
        systemRole: "standard",
        memberships: [
          {
            facilityId: "facility-1",
            role: "coach",
            access: "read/write",
            isActive: true,
          },
        ],
      },
      playerId: null,
    });
  });

  it("returns null and logs a redacted error when actor lookup fails", async () => {
    const logger = { error: jest.fn() };
    const queries = createQueries({
      findActorIdentity: jest.fn(async () => {
        throw new Error(
          "Couldn't connect to compute node at postgresql://user:secret@example.neon.tech/db"
        );
      }),
    });

    await expect(
      loadAuthSessionStateSafely("user-1", queries, logger)
    ).resolves.toBeNull();

    expect(logger.error).toHaveBeenCalledWith(
      "auth.session_lookup_failed",
      expect.objectContaining({
        userId: "user-1",
        error: expect.objectContaining({
          name: "Error",
          message:
            "Couldn't connect to compute node at postgres://[redacted]",
        }),
      })
    );
  });

  it("clears authorization claims from an existing token after failed hydration", () => {
    const token = {
      sub: "user-1",
      email: "coach@example.com",
      actor: { userId: "user-1" },
      systemRole: "super_admin",
      memberships: [{ facilityId: "facility-1", role: "admin" }],
      role: "admin",
      portalRole: "client",
      isPortalClient: true,
      facilityId: "facility-1",
      access: "read/write",
      playerId: "player-1",
    };

    expect(clearActorTokenClaims(token)).toEqual({
      sub: "user-1",
      email: "coach@example.com",
    });
  });
});
