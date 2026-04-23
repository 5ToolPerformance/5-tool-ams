import { getEvaluationDetail } from "@ams/application/players/development/getDevelopmentDocumentDetails";
import { updateEvaluation } from "@ams/application/evaluations/updateEvaluation";
import { listBucketsByIds } from "@ams/db/queries/config/listBucketsByIds";
import {
  assertPlayerAccess,
  getAuthContext,
  requireRole,
} from "@/application/auth/auth-context";

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

jest.mock("@ams/db", () => ({
  __esModule: true,
  default: {},
}));
jest.mock("@ams/application/players/development/getDevelopmentDocumentDetails", () => ({
  getEvaluationDetail: jest.fn(),
}));
jest.mock("@ams/application/evaluations/updateEvaluation", () => ({
  updateEvaluation: jest.fn(),
}));
jest.mock("@ams/db/queries/config/listBucketsByIds", () => ({
  listBucketsByIds: jest.fn(),
}));
jest.mock("@/application/auth/auth-context", () => ({
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

const {
  GET,
  PATCH,
} = require("@/app/api/evaluations/[evaluationId]/route");

describe("evaluation detail route", () => {
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
    (listBucketsByIds as jest.Mock).mockResolvedValue([]);
  });

  it("returns an evaluation detail payload for GET", async () => {
    (getEvaluationDetail as jest.Mock).mockResolvedValue({
      id: "eval-1",
      playerId: "player-1",
      disciplineId: "disc-1",
      evaluationDate: new Date("2026-03-18T00:00:00.000Z"),
      evaluationType: "monthly",
      phase: "preseason",
      snapshotSummary: "Snapshot",
      strengthProfileSummary: "Strength",
      keyConstraintsSummary: "Constraint",
      details: {
        strengths: ["Stable lower half"],
        focusAreas: [],
        constraints: [],
        evidence: [],
      },
      evidenceForms: [],
      attachments: [],
    });

    const response = await GET({} as any, {
      params: Promise.resolve({ evaluationId: "eval-1" }),
    });

    expect(response.status).toBe(200);
    expect(assertPlayerAccess).toHaveBeenCalledWith(
      expect.anything(),
      "player-1"
    );
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        id: "eval-1",
        playerId: "player-1",
      })
    );
  });

  it("updates an evaluation successfully", async () => {
    (updateEvaluation as jest.Mock).mockResolvedValue({ id: "eval-1" });

    const response = await PATCH(
      createJsonRequest({
        playerId: "player-1",
        disciplineId: "disc-1",
        evaluationDate: "2026-03-18T00:00:00.000Z",
        evaluationType: "monthly",
        phase: "preseason",
        snapshotSummary: "Snapshot",
        strengthProfileSummary: "Strength",
        keyConstraintsSummary: "Constraint",
        documentData: { version: 1, buckets: [] },
      }),
      { params: Promise.resolve({ evaluationId: "eval-1" }) }
    );

    expect(response.status).toBe(200);
    expect(updateEvaluation).toHaveBeenCalledWith(
      expect.anything(),
      "eval-1",
      expect.objectContaining({
        playerId: "player-1",
        createdBy: "coach-1",
      })
    );
  });
});
