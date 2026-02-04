export type PlayerAttachmentOverview = {
  id: string;
  type:
    | "file_csv"
    | "file_video"
    | "file_image"
    | "file_pdf"
    | "file_docx"
    | "manual";
  source: string;
  evidenceCategory?: string | null;
  visibility?: "internal" | "private" | "public" | null;
  documentType?:
    | "medical"
    | "pt"
    | "external"
    | "eval"
    | "general"
    | "other"
    | null;
  notes: string | null;
  createdAt: string;
  lessonPlayerId: string | null;
};
