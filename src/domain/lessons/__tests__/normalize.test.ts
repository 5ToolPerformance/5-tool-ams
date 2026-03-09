import { normalizeLessonForCreate } from "@/domain/lessons/normalize";

describe("normalizeLessonForCreate", () => {
  it("forces shared notes to empty string for single-player lessons", () => {
    const normalized = normalizeLessonForCreate({
      lessonType: "pitching",
      lessonDate: "2026-03-09",
      selectedPlayerIds: ["player-1"],
      players: {
        "player-1": {},
      },
      sharedNotes: {
        general: "Should be dropped",
      },
    });

    expect(normalized.lesson.sharedNotes).toBe("");
  });

  it("keeps shared notes for multi-player lessons", () => {
    const normalized = normalizeLessonForCreate({
      lessonType: "pitching",
      lessonDate: "2026-03-09",
      selectedPlayerIds: ["player-1", "player-2"],
      players: {
        "player-1": {},
        "player-2": {},
      },
      sharedNotes: {
        general: "All players worked from stretch",
      },
    });

    expect(normalized.lesson.sharedNotes).toBe("All players worked from stretch");
  });
});
