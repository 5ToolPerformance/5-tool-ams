export type Handedness = "right" | "left" | "switch";
export interface PlayerHeaderModel {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  age: number;
  sport: "baseball" | "softball";
  height: number | null;
  weight: number | null;
  primaryCoachId: string | null;
  primaryCoachName?: string | null;
  status?: {
    availability: "active" | "injured";
    restrictions: (string | null)[];
    injuryFlag: boolean;
    activeInjuryLevel: "soreness" | "injury" | "diagnosis" | null;
  };
  handedness: {
    bat: Handedness;
    throw: Handedness;
  };
  positions: {
    id: string;
    code: string;
    name: string;
    isPrimary: boolean;
  }[];
}
