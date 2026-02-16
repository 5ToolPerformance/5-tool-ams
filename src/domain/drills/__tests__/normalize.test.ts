import { normalizeDrillWriteInput } from "@/domain/drills/normalize";

describe("normalizeDrillWriteInput", () => {
  it("trims and validates title/description", () => {
    const normalized = normalizeDrillWriteInput({
      title: "  Pitching Balance Drill  ",
      description: "  Keep center of mass stable through delivery. ",
      discipline: "pitching",
      tags: [],
    });

    expect(normalized.title).toBe("Pitching Balance Drill");
    expect(normalized.description).toBe(
      "Keep center of mass stable through delivery."
    );
  });

  it("deduplicates and canonicalizes tags", () => {
    const normalized = normalizeDrillWriteInput({
      title: "A",
      description: "B",
      discipline: "hitting",
      tags: [" Rotation ", "rotation", "Video", "video", ""],
    });

    expect(normalized.tags).toEqual(["rotation", "video"]);
  });

  it("throws for empty title", () => {
    expect(() =>
      normalizeDrillWriteInput({
        title: "   ",
        description: "desc",
        discipline: "hitting",
        tags: [],
      })
    ).toThrow("Drill title is required");
  });

  it("throws for empty description", () => {
    expect(() =>
      normalizeDrillWriteInput({
        title: "title",
        description: "   ",
        discipline: "hitting",
        tags: [],
      })
    ).toThrow("Drill description is required");
  });

  it("throws for invalid discipline", () => {
    expect(() =>
      normalizeDrillWriteInput({
        title: "title",
        description: "desc",
        discipline: "speed" as never,
        tags: [],
      })
    ).toThrow("Invalid drill discipline");
  });
});
