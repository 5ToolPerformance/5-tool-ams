import { resolveStrengthEvidencePowerRating } from "@/domain/evaluations/strengthEvidence";

describe("resolveStrengthEvidencePowerRating", () => {
  it("calculates power rating from component scores even when a legacy power rating is present", () => {
    expect(
      resolveStrengthEvidencePowerRating({
        powerRating: "91",
        rotation: "80",
        lowerBodyStrength: "80",
        upperBodyStrength: "80",
      })
    ).toBe("80.00");
  });

  it("calculates power rating from the three component scores when explicit power rating is absent", () => {
    expect(
      resolveStrengthEvidencePowerRating({
        powerRating: null,
        rotation: "100",
        lowerBodyStrength: "80",
        upperBodyStrength: "60",
      })
    ).toBe("85.00");
  });

  it("falls back to legacy power rating when any component score is missing", () => {
    expect(
      resolveStrengthEvidencePowerRating({
        powerRating: "91",
        rotation: "100",
        lowerBodyStrength: "",
        upperBodyStrength: "60",
      })
    ).toBe("91");
  });

  it("returns null when any component score is missing and no legacy power rating exists", () => {
    expect(
      resolveStrengthEvidencePowerRating({
        powerRating: null,
        rotation: "100",
        lowerBodyStrength: "",
        upperBodyStrength: "60",
      })
    ).toBeNull();
  });
});
