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
      videoUrl: "",
    });

    expect(normalized.tags).toEqual(["rotation", "video"]);
  });

  it("normalizes blank video url to null", () => {
    const normalized = normalizeDrillWriteInput({
      title: "A",
      description: "B",
      discipline: "hitting",
      tags: [],
      videoUrl: "   ",
    });

    expect(normalized.videoUrl).toBeNull();
  });

  it("accepts and preserves valid youtube urls", () => {
    const normalized = normalizeDrillWriteInput({
      title: "A",
      description: "B",
      discipline: "hitting",
      tags: [],
      videoUrl: "https://youtu.be/dQw4w9WgXcQ",
    });

    expect(normalized.videoUrl).toBe("https://youtu.be/dQw4w9WgXcQ");
  });

  it("throws for invalid video urls", () => {
    expect(() =>
      normalizeDrillWriteInput({
        title: "title",
        description: "desc",
        discipline: "hitting",
        tags: [],
        videoUrl: "https://vimeo.com/123456",
      })
    ).toThrow("Video URL must be a valid YouTube link");
  });

  it("throws for empty title", () => {
    expect(() =>
      normalizeDrillWriteInput({
        title: "   ",
        description: "desc",
        discipline: "hitting",
        tags: [],
        videoUrl: null,
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
        videoUrl: null,
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
        videoUrl: null,
      })
    ).toThrow("Invalid drill discipline");
  });
});
