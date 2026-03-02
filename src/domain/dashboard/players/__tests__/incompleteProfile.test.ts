import { buildIncompletePlayerProfiles } from "@/domain/dashboard/players/incompleteProfile";

describe("incomplete dashboard profiles", () => {
  it("flags each missing field and invalid handedness", () => {
    const result = buildIncompletePlayerProfiles([
      {
        playerId: "p1",
        firstName: "",
        lastName: " ",
        primaryCoachId: null,
        throws: "ambi",
        hits: null,
        dateOfBirth: "2010-01-01",
        hasPrimaryPosition: false,
      },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].reasons).toEqual([
      "missing_first_name",
      "missing_last_name",
      "missing_primary_position",
      "missing_primary_coach",
      "invalid_throws",
      "invalid_hits",
    ]);
  });

  it("flags age under 5 years", () => {
    const nowYear = new Date().getFullYear();
    const dob = `${nowYear - 3}-01-01`;
    const result = buildIncompletePlayerProfiles([
      {
        playerId: "p1",
        firstName: "Test",
        lastName: "Player",
        primaryCoachId: "c1",
        throws: "right",
        hits: "left",
        dateOfBirth: dob,
        hasPrimaryPosition: true,
      },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].reasons).toEqual(["age_under_5"]);
  });

  it("excludes complete profiles", () => {
    const result = buildIncompletePlayerProfiles([
      {
        playerId: "p1",
        firstName: "Test",
        lastName: "Player",
        primaryCoachId: "c1",
        throws: "right",
        hits: "left",
        dateOfBirth: "2010-01-01",
        hasPrimaryPosition: true,
      },
    ]);

    expect(result).toEqual([]);
  });
});

