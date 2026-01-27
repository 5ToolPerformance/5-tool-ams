// domain/player/header/types.ts
export interface PlayerHeaderModel {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  age: number;
  sport: SportType;
  height: number | null;
  weight: number | null;
  primaryCoachId: string | null;
  positions: {
    id: string;
    code: string;
    name: string;
    isPrimary: boolean;
  }[];
}

export type SportType = "baseball" | "softball" | undefined;
