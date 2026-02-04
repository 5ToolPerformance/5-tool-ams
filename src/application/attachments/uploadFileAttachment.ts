// application/attachments/uploadFileAttachment.ts

import { AzureBlobStorage } from "@/application/storage/azureBlobStorage";
import db from "@/db";
import { attachmentFiles, attachments } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";

interface UploadFileAttachmentParams {
    athleteId: string;
    facilityId: string;
    createdBy: string;
    lessonPlayerId?: string;

    file: {
        buffer: Buffer;
        originalFileName: string;
        mimeType: string;
        fileSizeBytes: number;
    };

    type: "file_csv" | "file_video" | "file_image" | "file_pdf" | "file_docx";
    source: string;
    evidenceCategory?: string;
    visibility?: "internal" | "private" | "public";
    documentType?:
        | "medical"
        | "pt"
        | "external"
        | "eval"
        | "general"
        | "other";
    notes?: string;
}

export async function uploadFileAttachment(
    params: UploadFileAttachmentParams
) {
    const {
        athleteId,
        facilityId,
        createdBy,
        lessonPlayerId,
        file,
        type,
        source,
        evidenceCategory,
        visibility,
        documentType,
        notes,
    } = params;

    // 1️⃣ Generate attachment ID early
    const attachmentId = uuidv4();

    // 2️⃣ Generate storage key
    const extension =
        file.originalFileName.split(".").pop() ?? "bin";

    const storageKey = [
        "attachments",
        "facility",
        facilityId,
        "athlete",
        athleteId,
        `${attachmentId}.${extension}`,
    ].join("/");

    // 3️⃣ Upload file to Azure Blob Storage
    const storage = new AzureBlobStorage();

    await storage.uploadFile({
        buffer: file.buffer,
        storageKey,
        mimeType: file.mimeType,
    });

    // 4️⃣ Insert attachment record
    await db.insert(attachments).values({
        id: attachmentId,
        athleteId,
        facilityId,
        lessonPlayerId: lessonPlayerId ?? null,
        type,
        source,
        evidenceCategory: evidenceCategory ?? null,
        visibility: visibility ?? "internal",
        documentType: documentType ?? null,
        notes: notes ?? null,
        createdBy,
    });

    // 5️⃣ Insert attachment file metadata
    await db.insert(attachmentFiles).values({
        attachmentId,
        storageProvider: "azure_blob",
        storageKey,
        originalFileName: file.originalFileName,
        mimeType: file.mimeType,
        fileSizeBytes: file.fileSizeBytes,
    });

    // 6️⃣ Return summary (keep this small)
    return {
        id: attachmentId,
        athleteId,
        lessonPlayerId: lessonPlayerId ?? null,
        type,
        source,
        evidenceCategory: evidenceCategory ?? null,
        visibility: visibility ?? "internal",
        documentType: documentType ?? null,
        createdAt: new Date().toISOString(),
    };
}
