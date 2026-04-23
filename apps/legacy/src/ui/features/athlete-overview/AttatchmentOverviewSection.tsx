"use client";

import { Button, Chip } from "@heroui/react";

import { PlayerAttachmentOverview } from "@/domain/attachments/types";
import { useAttachmentViewer } from "@/ui/features/attachments/AttachmentViewerProvider";

interface PlayerAttachmentsViewerProps {
  attachments: PlayerAttachmentOverview[];
}

function typeIcon(type: PlayerAttachmentOverview["type"]) {
  switch (type) {
    case "file_csv":
      return "CSV";
    case "file_video":
      return "VID";
    case "file_image":
      return "IMG";
    case "file_pdf":
      return "PDF";
    case "file_docx":
      return "DOC";
    default:
      return "ATT";
  }
}

export function PlayerAttachmentsViewer({
  attachments,
}: PlayerAttachmentsViewerProps) {
  const { openAttachment } = useAttachmentViewer();

  if (attachments.length === 0) {
    return (
      <div className="rounded-lg border p-4 text-sm text-muted-foreground">
        No attachments uploaded yet.
      </div>
    );
  }

  return (
    <div className="h-full rounded-lg border shadow-sm">
      <div className="border-b px-4 py-2 font-semibold">Attachments</div>

      <div className="max-h-[420px] space-y-2 overflow-y-auto p-2">
        {attachments.map((a) => {
          const isLinked = a.lessonPlayerId !== null;
          const hasFile = Boolean(a.file?.storageKey);

          return (
            <div
              key={a.id}
              className={`rounded-md border p-3 text-sm ${
                isLinked ? "border-green-500/60" : "border-red-500/60"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span>{typeIcon(a.type)}</span>
                  <span className="font-medium capitalize">
                    {a.source.replace("_", " ")}
                  </span>
                </div>

                <Chip
                  size="sm"
                  color={isLinked ? "success" : "danger"}
                  variant="flat"
                >
                  {isLinked ? "Linked" : "Unlinked"}
                </Chip>
              </div>

              {a.notes && (
                <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  {a.notes}
                </div>
              )}

              {a.evidenceCategory === "context" && (
                <div className="mt-1 text-xs text-muted-foreground">
                  {[a.documentType, a.visibility]
                    .filter(Boolean)
                    .map((value) => (value as string).replace("_", " "))
                    .join(" - ")}
                </div>
              )}

              <div className="mt-1 text-xs text-muted-foreground">
                {new Date(a.createdAt).toLocaleString()}
              </div>

              <div className="mt-2 flex justify-end">
                <Button
                  size="sm"
                  variant="flat"
                  isDisabled={!hasFile}
                  onPress={() => openAttachment(a)}
                >
                  {hasFile ? "View" : "Missing file"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
