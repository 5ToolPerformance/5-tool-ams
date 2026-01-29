export interface PlayerUpsertInput {
  // identity
  firstName: string;
  lastName: string;
  date_of_birth: string; // YYYY-MM-DD
  sport: "baseball" | "softball";

  // physicals
  height: number | null;
  weight: number | null;

  // handedness
  throws: "right" | "left" | "switch" | null;
  hits: "right" | "left" | "switch" | null;

  // relationships
  primaryCoachId: string | null;

  primaryPositionId: string;
  secondaryPositionIds: string[];
}
