export interface Player {
  id: string | null;
  username?: string | null;
  name: string | null;
  email: string | null;
  image?: string | null;
  hits?: string | null;
  throws?: string | null;
  positions?: string | null;
  date_of_birth?: Date | null;
  height?: number | null;
  weight?: number | null;
}

export interface User {
  id: string;
  name: string | null;
  email: string | null;
}

export interface PlayerInformation {
  userId: string;
  height: number;
  weight: number;
  position: string;
  throws: string;
  hits: string;
  date_of_birth: Date;
}
