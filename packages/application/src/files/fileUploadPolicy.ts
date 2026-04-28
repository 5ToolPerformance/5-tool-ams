export type AttachmentFileType =
  | "file_csv"
  | "file_video"
  | "file_image"
  | "file_pdf"
  | "file_docx";

type FilePolicy = {
  maxBytes: number;
  extensions: readonly string[];
  mimeTypes: readonly string[];
};

const MB = 1024 * 1024;

const ATTACHMENT_POLICIES: Record<AttachmentFileType, FilePolicy> = {
  file_csv: {
    maxBytes: 25 * MB,
    extensions: ["csv"],
    mimeTypes: ["text/csv", "application/csv", "application/vnd.ms-excel"],
  },
  file_video: {
    maxBytes: 500 * MB,
    extensions: ["mp4", "mov", "webm"],
    mimeTypes: ["video/mp4", "video/quicktime", "video/webm"],
  },
  file_image: {
    maxBytes: 25 * MB,
    extensions: ["jpg", "jpeg", "png", "webp", "gif"],
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  },
  file_pdf: {
    maxBytes: 50 * MB,
    extensions: ["pdf"],
    mimeTypes: ["application/pdf"],
  },
  file_docx: {
    maxBytes: 25 * MB,
    extensions: ["docx"],
    mimeTypes: [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
};

const DRILL_FILE_POLICY: FilePolicy = {
  maxBytes: 500 * MB,
  extensions: ["jpg", "jpeg", "png", "webp", "gif", "mp4", "mov", "webm"],
  mimeTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/quicktime",
    "video/webm",
  ],
};

export function getFileExtension(fileName: string) {
  const extension = fileName.trim().toLowerCase().split(".").pop();
  return extension && /^[a-z0-9]+$/.test(extension) ? extension : null;
}

function assertAllowedFile(
  policy: FilePolicy,
  file: { originalFileName: string; mimeType: string; size: number }
) {
  const extension = getFileExtension(file.originalFileName);
  const mimeType = file.mimeType.toLowerCase();

  if (!file.originalFileName.trim() || !extension) {
    throw new Error("Missing file name");
  }

  if (file.size <= 0) {
    throw new Error("Missing file size");
  }

  if (file.size > policy.maxBytes) {
    throw new Error("File too large");
  }

  if (!policy.extensions.includes(extension)) {
    throw new Error("File extension is not allowed");
  }

  if (!policy.mimeTypes.includes(mimeType)) {
    throw new Error("File type is not allowed");
  }

  return extension;
}

export function assertAllowedAttachmentFile(
  type: AttachmentFileType,
  file: { originalFileName: string; mimeType: string; size: number }
) {
  return assertAllowedFile(ATTACHMENT_POLICIES[type], file);
}

export function assertAllowedDrillFile(file: {
  originalFileName: string;
  mimeType: string;
  size: number;
}) {
  return assertAllowedFile(DRILL_FILE_POLICY, file);
}

export function buildDrillStorageKey(input: {
  facilityId: string;
  drillId: string;
  fileId: string;
  extension: string;
}) {
  return [
    "drills",
    "facility",
    input.facilityId,
    "drill",
    input.drillId,
    `${input.fileId}.${input.extension}`,
  ].join("/");
}
