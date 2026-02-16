export type DrillDiscipline =
  | "hitting"
  | "pitching"
  | "strength"
  | "fielding"
  | "catching"
  | "arm_care";

export type DrillMedia = {
  fileId: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdOn: string;
};

export type Drill = {
  id: string;
  title: string;
  description: string;
  discipline: DrillDiscipline;
  createdBy: {
    id: string;
    name: string | null;
  };
  createdOn: string;
  updatedOn: string;
  tags: string[];
  media: DrillMedia[];
};

export type DrillListItem = {
  id: string;
  title: string;
  description: string;
  discipline: DrillDiscipline;
  createdBy: {
    id: string;
    name: string | null;
  };
  createdOn: string;
  updatedOn: string;
  tags: string[];
  mediaCount: number;
  canEdit: boolean;
};
