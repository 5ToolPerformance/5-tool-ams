import { hydrateLessonForm } from "@/domain/lessons/hydrate";

describe("hydrateLessonForm", () => {
  it("rehydrates drills and applied routines for a player", () => {
    const values = hydrateLessonForm({
      lesson: {
        id: "lesson-1",
        date: "2026-03-09",
        type: "pitching",
        sharedNotes: "",
      },
      participants: [
        {
          playerId: "player-1",
          lessonPlayerId: "lesson-player-1",
          notes: "Player note",
          routineSelections: [
            {
              source: "universal",
              routineId: "routine-1",
              routineType: "partial_lesson",
              title: "Universal warmup",
              document: {
                version: 1,
                visibility: "universal",
                disciplineId: "disc-1",
                overview: {},
                mechanics: [{ mechanicId: "mechanic-1" }],
                blocks: [
                  {
                    id: "block-1",
                    title: "Block 1",
                    sortOrder: 0,
                    drills: [{ drillId: "drill-1", sortOrder: 0 }],
                  },
                ],
              },
            },
          ],
        },
      ],
      mechanics: [
        {
          playerId: "player-1",
          mechanicId: "mechanic-1",
          notes: "Mechanic note",
        },
      ],
      drills: [
        {
          playerId: "player-1",
          drillId: "drill-1",
          notes: "Drill note",
        },
      ],
    });

    expect(values.players["player-1"]?.drills).toEqual({
      "drill-1": { notes: "Drill note" },
    });
    expect(values.players["player-1"]?.routineSelections).toHaveLength(1);
    expect(values.players["player-1"]?.routineSelections?.[0]).toMatchObject({
      source: "universal",
      routineId: "routine-1",
      title: "Universal warmup",
    });
  });
});
