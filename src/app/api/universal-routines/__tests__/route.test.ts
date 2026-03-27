import { createUniversalRoutine } from "@/application/routines/createUniversalRoutine";
import { updateUniversalRoutine } from "@/application/routines/updateUniversalRoutine";
import { getUniversalRoutineById } from "@/db/queries/routines/getUniversalRoutineById";
import {
  assertCanEditUniversalRoutine,
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
jest.mock("@/application/routines/createUniversalRoutine", () => ({
  createUniversalRoutine: jest.fn(),
}));
jest.mock("@/application/routines/updateUniversalRoutine", () => ({
  updateUniversalRoutine: jest.fn(),
}));
jest.mock("@/db/queries/routines/getUniversalRoutineById", () => ({
  getUniversalRoutineById: jest.fn(),
}));
jest.mock("@/lib/auth/auth-context", () => ({
  AuthError: class AuthError extends Error {
    status: number;

    constructor(message: string, status = 401) {
      super(message);
      this.status = status;
    }
  },
  assertCanEditUniversalRoutine: jest.fn(),
  getAuthContext: jest.fn(),
  requireRole: jest.fn(),
}));

const { POST } = require("@/app/api/universal-routines/route");
const { PATCH } = require("@/app/api/universal-routines/[routineId]/route");

describe("universal routine routes", () => {
  function createJsonRequest(body: unknown) {
    return {
      json: async () => body,
    } as any;
  }

  beforeEach(() => {
    jest.resetAllMocks();
    (getAuthContext as jest.Mock).mockResolvedValue({
      userId: "coach-1",
      facilityId: "facility-1",
    });
    (requireRole as jest.Mock).mockImplementation(() => undefined);
    (assertCanEditUniversalRoutine as jest.Mock).mockResolvedValue(undefined);
  });

  it("creates a universal routine successfully", async () => {
    (createUniversalRoutine as jest.Mock).mockResolvedValue({ id: "routine-1" });

    const response = await POST(
      createJsonRequest({
        title: "Universal routine",
        disciplineId: "disc-1",
        routineType: "partial_lesson",
        documentData: { version: 1 },
      })
    );

    expect(response.status).toBe(201);
    expect(createUniversalRoutine).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        createdBy: "coach-1",
        facilityId: "facility-1",
      })
    );
  });

  it("returns 400 when universal routine creation fails validation", async () => {
    (createUniversalRoutine as jest.Mock).mockRejectedValue(
      new DomainError("title is required.")
    );

    const response = await POST(
      createJsonRequest({
        title: "",
        disciplineId: "disc-1",
        routineType: "partial_lesson",
      })
    );

    expect(response.status).toBe(400);
  });

  it("updates a universal routine successfully", async () => {
    (getUniversalRoutineById as jest.Mock).mockResolvedValue({
      id: "routine-1",
      disciplineId: "disc-1",
    });
    (updateUniversalRoutine as jest.Mock).mockResolvedValue({ id: "routine-1" });

    const response = await PATCH(
      createJsonRequest({
        title: "Updated universal routine",
        disciplineId: "disc-1",
        routineType: "partial_lesson",
        documentData: { version: 1 },
      }),
      { params: Promise.resolve({ routineId: "routine-1" }) }
    );

    expect(response.status).toBe(200);
    expect(assertCanEditUniversalRoutine).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "coach-1" }),
      "routine-1"
    );
    expect(updateUniversalRoutine).toHaveBeenCalledWith(
      expect.anything(),
      "routine-1",
      expect.objectContaining({ createdBy: "coach-1" })
    );
  });

  it("returns 404 when the universal routine is missing during update", async () => {
    (getUniversalRoutineById as jest.Mock).mockRejectedValue(
      new NotFoundError("Universal routine not found.")
    );

    const response = await PATCH(
      createJsonRequest({
        title: "Updated universal routine",
        disciplineId: "disc-1",
        routineType: "partial_lesson",
      }),
      { params: Promise.resolve({ routineId: "missing" }) }
    );

    expect(response.status).toBe(404);
  });
});
