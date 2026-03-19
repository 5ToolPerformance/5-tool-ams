export type MechanicType =
  | "pitching"
  | "hitting"
  | "fielding"
  | "catching"
  | "strength";

export type MechanicListItem = {
  id: string;
  name: string;
  description: string | null;
  type: MechanicType;
  tags: string[] | null;
  createdAt?: string;
  updatedAt?: string;
};
