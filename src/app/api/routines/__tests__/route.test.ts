import { createRoutine } from "@/application/routines/createRoutine";
import { updateRoutine } from "@/application/routines/updateRoutines";
import { getDevelopmentPlanById } from "@/db/queries/development-plans/getDevelopmentPlanById";
import { getRoutineById } from "@/db/queries/routines/getRoutineById";
import {
  assertPlayerAccess,
  getAuthContext,
  requireRole,
} from "@/lib/auth/auth-context";
import { DomainError, NotFoundError } from "@/lib/errors";

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

jest.mock("@/db", () => ({
  __esModule: true,
  default: {},
}));
jest.mock("@/application/routines/createRoutine", () => ({
  createRoutine: jest.fn(),
}));
jest.mock("@/application/routines/updateRoutines", () => ({
  updateRoutine: jest.fn(),
}));
jest.mock("@/db/queries/development-plans/getDevelopmentPlanById", () => ({
  getDevelopmentPlanById: jest.fn(),
}));
jest.mock("@/db/queries/routines/getRoutineById", () => ({
  getRoutineById: jest.fn(),
}));
jest.mock("@/lib/auth/auth-context", () => ({
  AuthError: class AuthError extends Error {
    status: number;

    constructor(message: string, status = 401) {
      super(message);
      this.status = status;
    }
  },
  assertPlayerAccess: jest.fn(),
  getAuthContext: jest.fn(),
  requireRole: jest.fn(),
}));

const { POST } = require("@/app/api/routines/route");
const { PATCH } = require("@/app/api/routines/[routineId]/route");

describe("routine routes", () => {
  function createJsonRequest(body: unknown) {
    return {
      json: async () => body,
    } as any;
  }

  beforeEach(() => {
    jest.resetAllMocks();
    (getAuthContext as jest.Mock).mockResolvedValue({ userId: "coach-1" });
    (requireRole as jest.Mock).mockImplementation(() => undefined);
    (assertPlayerAccess as jest.Mock).mockResolvedValue(undefined);
  });

  it("creates a routine successfully", async () => {
    (getDevelopmentPlanById as jest.Mock).mockResolvedValue({
      id: "plan-1",
      playerId: "player-1",
    });
    (createRoutine as jest.Mock).mockResolvedValue({ id: "routine-1" });

    const response = await POST(
      createJsonRequest({
        developmentPlanId: "plan-1",
        title: "Routine",
        routineType: "partial_lesson",
        documentData: { version: 1 },
      })
    );

    expect(response.status).toBe(201);
    expect(createRoutine).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        developmentPlanId: "plan-1",
        createdBy: "coach-1",
      })
    );
  });

  it("returns 404 when the development plan is missing during create", async () => {
    (getDevelopmentPlanById as jest.Mock).mockRejectedValue(
      new NotFoundError("Development plan not found.")
    );

    const response = await POST(
      createJsonRequest({
        developmentPlanId: "missing",
        title: "Routine",
        routineType: "partial_lesson",
        documentData: { version: 1 },
      })
    );

    expect(response.status).toBe(404);
  });

  it("returns 400 when create rejects an invalid routine document", async () => {
    (getDevelopmentPlanById as jest.Mock).mockResolvedValue({
      id: "plan-1",
      playerId: "player-1",
    });
    (createRoutine as jest.Mock).mockRejectedValue(
      new DomainError("title is required.")
    );

    const response = await POST(
      createJsonRequest({
        developmentPlanId: "plan-1",
        title: "",
        routineType: "partial_lesson",
        documentData: { version: 1 },
      })
    );

    expect(response.status).toBe(400);
  });

  it("updates a routine successfully", async () => {
    (getRoutineById as jest.Mock).mockResolvedValue({
      id: "routine-1",
      developmentPlanId: "plan-1",
    });
    (getDevelopmentPlanById as jest.Mock).mockResolvedValue({
      id: "plan-1",
      playerId: "player-1",
    });
    (updateRoutine as jest.Mock).mockResolvedValue({ id: "routine-1" });

    const response = await PATCH(
      createJsonRequest({
        title: "Updated routine",
        routineType: "partial_lesson",
        documentData: { version: 1 },
      }),
      { params: Promise.resolve({ routineId: "routine-1" }) }
    );

    expect(response.status).toBe(200);
    expect(updateRoutine).toHaveBeenCalledWith(
      expect.anything(),
      "routine-1",
      expect.objectContaining({
        developmentPlanId: "plan-1",
        createdBy: "coach-1",
      })
    );
  });
});
