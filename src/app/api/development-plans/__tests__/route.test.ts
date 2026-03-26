import { createDevelopmentPlan } from "@/application/development-plans/createDevelopmentPlan";
import { getDevelopmentPlanDetail } from "@/application/players/development/getDevelopmentDocumentDetails";
import { updateDevelopmentPlan } from "@/application/development-plans/updateDevelopmentPlan";
import { getDevelopmentPlanById } from "@/db/queries/development-plans/getDevelopmentPlanById";
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
jest.mock("@/application/development-plans/createDevelopmentPlan", () => ({
  createDevelopmentPlan: jest.fn(),
}));
jest.mock("@/application/players/development/getDevelopmentDocumentDetails", () => ({
  getDevelopmentPlanDetail: jest.fn(),
}));
jest.mock("@/application/development-plans/updateDevelopmentPlan", () => ({
  updateDevelopmentPlan: jest.fn(),
}));
jest.mock("@/db/queries/development-plans/getDevelopmentPlanById", () => ({
  getDevelopmentPlanById: jest.fn(),
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

const { POST } = require("@/app/api/development-plans/route");
const {
  GET,
  PATCH,
} = require("@/app/api/development-plans/[developmentPlanId]/route");

describe("development plan routes", () => {
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

  it("creates a development plan successfully", async () => {
    (createDevelopmentPlan as jest.Mock).mockResolvedValue({ id: "plan-1" });

    const response = await POST(
      createJsonRequest({
        playerId: "player-1",
        disciplineId: "disc-1",
        evaluationId: "eval-1",
        status: "draft",
        startDate: "2026-03-18T00:00:00.000Z",
        targetEndDate: null,
        documentData: { version: 1 },
      })
    );

    expect(response.status).toBe(201);
    expect(createDevelopmentPlan).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        playerId: "player-1",
        disciplineId: "disc-1",
        evaluationId: "eval-1",
        createdBy: "coach-1",
      })
    );
  });

  it("returns 404 when the evaluation is missing during create", async () => {
    (createDevelopmentPlan as jest.Mock).mockRejectedValue(
      new NotFoundError("Evaluation not found.")
    );

    const response = await POST(
      createJsonRequest({
        playerId: "player-1",
        disciplineId: "disc-1",
        evaluationId: "missing",
        status: "draft",
        documentData: { version: 1 },
      })
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "Evaluation not found.",
    });
  });

  it("returns 400 when create violates evaluation discipline or player invariants", async () => {
    (createDevelopmentPlan as jest.Mock).mockRejectedValue(
      new DomainError("Development plan discipline must match evaluation discipline.")
    );

    const response = await POST(
      createJsonRequest({
        playerId: "player-1",
        disciplineId: "disc-2",
        evaluationId: "eval-1",
        status: "draft",
        documentData: { version: 1 },
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error:
        "Development plan discipline must match evaluation discipline.",
    });
  });

  it("updates a development plan successfully", async () => {
    (getDevelopmentPlanById as jest.Mock).mockResolvedValue({
      id: "plan-1",
      playerId: "player-1",
    });
    (updateDevelopmentPlan as jest.Mock).mockResolvedValue({ id: "plan-1" });

    const response = await PATCH(
      createJsonRequest({
        status: "active",
        startDate: "2026-03-18T00:00:00.000Z",
        documentData: { version: 1 },
      }),
      { params: Promise.resolve({ developmentPlanId: "plan-1" }) }
    );

    expect(response.status).toBe(200);
    expect(updateDevelopmentPlan).toHaveBeenCalledWith(
      expect.anything(),
      "plan-1",
      expect.objectContaining({
        status: "active",
      })
    );
  });

  it("returns a development plan detail payload for GET", async () => {
    (getDevelopmentPlanDetail as jest.Mock).mockResolvedValue({
      id: "plan-1",
      playerId: "player-1",
      disciplineId: "disc-1",
      evaluationId: "eval-1",
      status: "active",
      startDate: new Date("2026-03-18T00:00:00.000Z"),
      targetEndDate: null,
      details: {
        summary: "Summary",
        currentPriority: "Priority",
        shortTermGoals: [],
        longTermGoals: [],
        focusAreas: [],
        measurableIndicators: [],
      },
      linkedEvaluation: null,
    });

    const response = await GET({} as any, {
      params: Promise.resolve({ developmentPlanId: "plan-1" }),
    });

    expect(response.status).toBe(200);
    expect(assertPlayerAccess).toHaveBeenCalledWith(
      expect.anything(),
      "player-1"
    );
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        id: "plan-1",
        playerId: "player-1",
      })
    );
  });
});
