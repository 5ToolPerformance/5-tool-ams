export type AttachmentViewerFile = {
  originalFileName: string | null;
  mimeType: string | null;
  fileSizeBytes: number | null;
  storageKey: string | null;
};

export type AttachmentViewerAttachment = {
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
  effectiveDate?: string | null;
  notes?: string | null;
  createdAt: string;
  file?: AttachmentViewerFile | null;
};

export function getAttachmentDisplayName(
  attachment: AttachmentViewerAttachment
) {
  return (
    attachment.file?.originalFileName ??
    attachment.source ??
    "Attachment"
  );
}

export function getAttachmentTypeLabel(
  type: AttachmentViewerAttachment["type"]
) {
  switch (type) {
    case "file_csv":
      return "CSV";
    case "file_video":
      return "Video";
    case "file_image":
      return "Image";
    case "file_pdf":
      return "PDF";
    case "file_docx":
      return "DOCX";
    case "manual":
      return "Manual";
    default:
      return "Attachment";
  }
}
