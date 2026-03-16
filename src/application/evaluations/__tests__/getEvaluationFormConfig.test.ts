import { getEvaluationFormConfig } from "@/application/evaluations/getEvaluationFormConfig";
import { listActiveBuckets } from "@/db/queries/config/listActiveBuckets";
import { listActiveDisciplines } from "@/db/queries/config/listActiveDisciplines";

jest.mock("@/db/queries/config/listActiveDisciplines", () => ({
  listActiveDisciplines: jest.fn(),
}));

jest.mock("@/db/queries/config/listActiveBuckets", () => ({
  listActiveBuckets: jest.fn(),
}));

describe("getEvaluationFormConfig", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns active disciplines and buckets", async () => {
    (listActiveDisciplines as jest.Mock).mockResolvedValue([
      { id: "disc-2", key: "hitting", label: "Hitting" },
      { id: "disc-1", key: "pitching", label: "Pitching" },
    ]);
    (listActiveBuckets as jest.Mock).mockResolvedValue([
      {
        id: "bucket-1",
        disciplineId: "disc-1",
        key: "velo",
        label: "Velocity",
        description: "Fastball velocity",
        sortOrder: 1,
        active: true,
      },
    ]);

    const result = await getEvaluationFormConfig();

    expect(result.disciplineOptions).toHaveLength(2);
    expect(result.disciplineOptions[0].label).toBe("Hitting");
    expect(result.bucketOptions).toEqual([
      expect.objectContaining({
        id: "bucket-1",
        disciplineId: "disc-1",
        label: "Velocity",
      }),
    ]);
  });
});
