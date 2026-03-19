export const DRILL_DISCIPLINES = [
  "hitting",
  "pitching",
  "strength",
  "fielding",
  "catching",
  "arm_care",
] as const;

export type DrillDiscipline = (typeof DRILL_DISCIPLINES)[number];

export type DrillWriteInput = {
  title: string;
  description: string;
  discipline: DrillDiscipline;
  tags: string[];
  videoUrl?: string | null;
};

export type DrillMediaItem = {
  fileId: string;
  originalName: string;
  mimeType: string;
  size: number;
  storageKey: string;
  createdOn: string;
};

export type DrillReadModel = {
  id: string;
  title: string;
  description: string;
  discipline: DrillDiscipline;
  videoProvider: "youtube" | null;
  videoId: string | null;
  videoUrl: string | null;
  createdBy: {
    id: string;
    name: string | null;
  };
  createdOn: string;
  updatedOn: string;
  tags: string[];
  media: DrillMediaItem[];
};

export type DrillListItem = {
  id: string;
  title: string;
  description: string;
  discipline: DrillDiscipline;
  videoProvider: "youtube" | null;
  videoId: string | null;
  videoUrl: string | null;
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
