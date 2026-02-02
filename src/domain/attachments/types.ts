export type PlayerAttachmentOverview = {
  id: string;
  type: "file_csv" | "file_video" | "manual";
  source: string;
  notes: string | null;
  createdAt: string;
  lessonPlayerId: string | null;
};
