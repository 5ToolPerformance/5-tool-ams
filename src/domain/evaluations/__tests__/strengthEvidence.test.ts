import { resolveStrengthEvidencePowerRating } from "@/domain/evaluations/strengthEvidence";

describe("resolveStrengthEvidencePowerRating", () => {
  it("prefers an explicit power rating when present", () => {
    expect(
      resolveStrengthEvidencePowerRating({
        powerRating: "91",
        rotation: "80",
        lowerBodyStrength: "80",
        upperBodyStrength: "80",
      })
    ).toBe("91");
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

  it("returns null when any component score is missing", () => {
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
