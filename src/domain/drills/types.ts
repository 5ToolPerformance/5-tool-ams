export type DrillWriteInput = {
  title: string;
  description: string;
  tags: string[];
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
