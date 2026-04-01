import {
  AuthError,
  assertPlayerAccess,
  getAuthContext,
} from "@/lib/auth/auth-context";
import { loadPlayerDevelopmentPageData } from "@/application/players/development/loadPlayerDevelopmentPageData";

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

jest.mock("@/lib/auth/auth-context", () => ({
  AuthError: class AuthError extends Error {
    status: number;

    constructor(status: number, message: string) {
      super(message);
      this.status = status;
    }
  },
  assertPlayerAccess: jest.fn(),
  getAuthContext: jest.fn(),
}));

jest.mock(
  "@/application/players/development/loadPlayerDevelopmentPageData",
  () => ({
    loadPlayerDevelopmentPageData: jest.fn(),
  })
);

const { GET } = require("@/app/api/players/[id]/development/route");

describe("player development route", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (getAuthContext as jest.Mock).mockResolvedValue({
      userId: "coach-1",
      role: "coach",
      facilityId: "facility-1",
      playerId: null,
      email: "coach@example.com",
    });
    (assertPlayerAccess as jest.Mock).mockResolvedValue(undefined);
  });

  it("returns selected-discipline development data", async () => {
    (loadPlayerDevelopmentPageData as jest.Mock).mockResolvedValue({
      data: {
        selectedDiscipline: { id: "disc-1", key: "pitching", label: "Pitching" },
      },
      routineFormConfig: {
        developmentPlanOptions: [
          {
            id: "plan-1",
            playerId: "player-1",
            disciplineId: "disc-1",
            disciplineKey: "pitching",
            disciplineLabel: "Pitching",
            status: "active",
            title: "Active plan",
          },
        ],
        disciplineOptions: [{ id: "disc-1", key: "pitching", label: "Pitching" }],
        mechanicOptions: [],
        drillOptions: [],
      },
    });

    const response = await GET(
      {
        nextUrl: new URL("http://localhost/api/players/player-1/development?discipline=disc-1"),
      } as any,
      { params: Promise.resolve({ id: "player-1" }) }
    );

    expect(response.status).toBe(200);
    expect(assertPlayerAccess).toHaveBeenCalledWith(expect.anything(), "player-1");
    expect(loadPlayerDevelopmentPageData).toHaveBeenCalledWith({
      playerId: "player-1",
      discipline: "disc-1",
      authContext: expect.objectContaining({
        userId: "coach-1",
        facilityId: "facility-1",
      }),
    });
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          selectedDiscipline: expect.objectContaining({ id: "disc-1" }),
        }),
        routineFormConfig: expect.objectContaining({
          developmentPlanOptions: expect.arrayContaining([
            expect.objectContaining({ id: "plan-1" }),
          ]),
        }),
      })
    );
  });

  it("enforces player access before loading development data", async () => {
    (assertPlayerAccess as jest.Mock).mockRejectedValue(
      new AuthError(403, "Forbidden")
    );

    const response = await GET(
      {
        nextUrl: new URL("http://localhost/api/players/player-1/development"),
      } as any,
      { params: Promise.resolve({ id: "player-1" }) }
    );

    expect(loadPlayerDevelopmentPageData).not.toHaveBeenCalled();
    expect(response.status).toBe(403);
  });
});
