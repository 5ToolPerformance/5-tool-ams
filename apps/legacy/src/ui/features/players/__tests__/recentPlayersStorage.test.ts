import {
  clearRecentPlayerIds,
  normalizeRecentPlayerIds,
  removeRecentPlayerId,
  upsertRecentPlayerId,
} from "@/ui/features/players/recentPlayersStorage";

describe("recentPlayersStorage helpers", () => {
  it("deduplicates and limits ids to 10", () => {
    const ids = normalizeRecentPlayerIds([
      "1",
      "2",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ]);

    expect(ids).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
  });

  it("moves selected player to the front", () => {
    const ids = upsertRecentPlayerId(["a", "b", "c"], "b");
    expect(ids).toEqual(["b", "a", "c"]);
  });

  it("removes a player id from recent list", () => {
    const setItem = jest.fn();
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => JSON.stringify(["a", "b", "c"])),
        setItem,
      },
      writable: true,
    });

    const ids = removeRecentPlayerId("user-1", "b");
    expect(ids).toEqual(["a", "c"]);
    expect(setItem).toHaveBeenCalledWith(
      "players:recent:user-1",
      JSON.stringify(["a", "c"])
    );
  });

  it("clears all recent player ids", () => {
    const setItem = jest.fn();
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(),
        setItem,
      },
      writable: true,
    });

    const ids = clearRecentPlayerIds("user-1");
    expect(ids).toEqual([]);
    expect(setItem).toHaveBeenCalledWith(
      "players:recent:user-1",
      JSON.stringify([])
    );
  });
});
