import { PlayerDirectoryItem } from "@/domain/player/directory";
import {
  applyPlayerDirectoryFilters,
  hasActiveDirectoryFilters,
} from "@/ui/features/players/playerDirectory.utils";

const players: PlayerDirectoryItem[] = [
  {
    id: "p-1",
    firstName: "Alex",
    lastName: "Rivera",
    age: 16,
    dateOfBirth: "2009-01-01",
    sport: "baseball",
    throws: "right",
    hits: "left",
    prospect: true,
    primaryCoachId: "coach-1",
    createdAt: "2026-01-01T00:00:00.000Z",
    primaryPosition: { id: "pos-p", code: "P", name: "Pitcher" },
    secondaryPositions: [{ id: "pos-1b", code: "1B", name: "First Base" }],
    injuryStatus: "injured",
    injuryActiveCount: 1,
  },
  {
    id: "p-2",
    firstName: "Ben",
    lastName: "Miller",
    age: 15,
    dateOfBirth: "2010-01-01",
    sport: "baseball",
    throws: "left",
    hits: "left",
    prospect: false,
    primaryCoachId: "coach-2",
    createdAt: "2026-01-01T00:00:00.000Z",
    primaryPosition: { id: "pos-c", code: "C", name: "Catcher" },
    secondaryPositions: [],
    injuryStatus: "none",
    injuryActiveCount: 0,
  },
];

describe("playerDirectory.utils", () => {
  it("applies combined filters", () => {
    const filtered = applyPlayerDirectoryFilters(players, {
      searchTerm: "alex",
      ageFilter: "16",
      positionFilter: "pos-p",
      injuryStatusFilter: "injured",
      prospectFilter: "prospect",
      sortBy: "lastName",
      sortOrder: "asc",
    });

    expect(filtered.map((player) => player.id)).toEqual(["p-1"]);
  });

  it("detects active filters", () => {
    expect(
      hasActiveDirectoryFilters({
        searchTerm: "",
        ageFilter: "",
        positionFilter: "",
        injuryStatusFilter: "",
        prospectFilter: "",
        sortBy: "lastName",
        sortOrder: "asc",
      })
    ).toBe(false);

    expect(
      hasActiveDirectoryFilters({
        searchTerm: "",
        ageFilter: "",
        positionFilter: "",
        injuryStatusFilter: "injured",
        prospectFilter: "",
        sortBy: "lastName",
        sortOrder: "asc",
      })
    ).toBe(true);
  });
});
