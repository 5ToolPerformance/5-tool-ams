import { getDashboardPlayersData } from "@/application/dashboard/getDashboardPlayersData";
import { getDashboardPlayerMetrics } from "@/db/queries/dashboard/getDashboardPlayerMetrics";
import { getIncompletePlayerProfiles } from "@/db/queries/dashboard/getIncompletePlayerProfiles";
import { DashboardRangeWindow } from "@/domain/dashboard/types";

jest.mock("@/db/queries/dashboard/getDashboardPlayerMetrics", () => ({
  getDashboardPlayerMetrics: jest.fn(),
}));

jest.mock("@/db/queries/dashboard/getIncompletePlayerProfiles", () => ({
  getIncompletePlayerProfiles: jest.fn(),
}));

const range: DashboardRangeWindow = {
  key: "30d",
  startIso: "2026-02-03",
  endIso: "2026-03-05",
};

describe("getDashboardPlayersData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("treats non-boolean falsey primary-position values as missing", async () => {
    (getDashboardPlayerMetrics as jest.Mock).mockResolvedValue([]);
    (getIncompletePlayerProfiles as jest.Mock).mockResolvedValue([
      {
        playerId: "p1",
        firstName: "Alex",
        lastName: "Player",
        primaryCoachId: "coach-1",
        throws: "right",
        hits: "left",
        dateOfBirth: "2010-01-01",
        hasPrimaryPosition: "f",
      },
      {
        playerId: "p2",
        firstName: "Sam",
        lastName: "Player",
        primaryCoachId: "coach-2",
        throws: "right",
        hits: "left",
        dateOfBirth: "2010-01-01",
        hasPrimaryPosition: 0,
      },
      {
        playerId: "p3",
        firstName: "Chris",
        lastName: "Player",
        primaryCoachId: "coach-3",
        throws: "right",
        hits: "left",
        dateOfBirth: "2010-01-01",
        hasPrimaryPosition: "true",
      },
    ]);

    const result = await getDashboardPlayersData("facility-1", range);

    expect(result.incompleteProfiles).toHaveLength(2);
    expect(result.incompleteProfiles[0].reasons).toContain("missing_primary_position");
    expect(result.incompleteProfiles[1].reasons).toContain("missing_primary_position");
  });
});
