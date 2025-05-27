export interface Player {
  id: string;
  username?: string | null;
  name: string | null;
  email: string;
  image?: string;
  hits?: string;
  throws?: string;
  positions?: string;
  date_of_birth?: Date;
  height?: number;
  weight?: number;
}
