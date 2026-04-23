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

  it("rejects mixing full and partial lesson routines for the same player", () => {
    expect(() =>
      normalizeLessonForCreate({
        lessonType: "pitching",
        lessonDate: "2026-03-09",
        selectedPlayerIds: ["player-1"],
        players: {
          "player-1": {
            routineSelections: [
              {
                source: "player",
                routineId: "routine-1",
                routineType: "full_lesson",
                title: "Full routine",
              },
              {
                source: "universal",
                routineId: "routine-2",
                routineType: "partial_lesson",
                title: "Partial routine",
              },
            ],
          },
        },
      })
    ).toThrow("Full lesson and partial lesson routines cannot be mixed");
  });

  it("preserves selected routine metadata per player", () => {
    const normalized = normalizeLessonForCreate({
      lessonType: "pitching",
      lessonDate: "2026-03-09",
      selectedPlayerIds: ["player-1"],
      players: {
        "player-1": {
          routineSelections: [
            {
              source: "universal",
              routineId: "routine-1",
              routineType: "partial_lesson",
              title: "Universal warmup",
            },
          ],
        },
      },
    });

    expect(normalized.participants[0].routineSelections).toEqual([
      {
        source: "universal",
        routineId: "routine-1",
        routineType: "partial_lesson",
        title: "Universal warmup",
      },
    ]);
  });
});
