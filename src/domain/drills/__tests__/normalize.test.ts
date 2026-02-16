import { normalizeDrillWriteInput } from "@/domain/drills/normalize";

describe("normalizeDrillWriteInput", () => {
  it("trims and validates title/description", () => {
    const normalized = normalizeDrillWriteInput({
      title: "  Pitching Balance Drill  ",
      description: "  Keep center of mass stable through delivery. ",
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
      tags: [" Rotation ", "rotation", "Video", "video", ""],
    });

    expect(normalized.tags).toEqual(["rotation", "video"]);
  });

  it("throws for empty title", () => {
    expect(() =>
      normalizeDrillWriteInput({
        title: "   ",
        description: "desc",
        tags: [],
      })
    ).toThrow("Drill title is required");
  });

  it("throws for empty description", () => {
    expect(() =>
      normalizeDrillWriteInput({
        title: "title",
        description: "   ",
        tags: [],
      })
    ).toThrow("Drill description is required");
  });
});
