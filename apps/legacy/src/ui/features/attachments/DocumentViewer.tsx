"use client";

import { useMemo, useState } from "react";

import { Button } from "@heroui/react";

import type { AttachmentViewerAttachment } from "@/ui/features/attachments/types";

type DocumentViewerProps = {
  attachment: AttachmentViewerAttachment;
  streamUrl: string;
};

export function DocumentViewer({
  attachment,
  streamUrl,
}: DocumentViewerProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  const isPdf = useMemo(() => {
    if (attachment.type === "file_pdf") return true;
    const name = attachment.file?.originalFileName?.toLowerCase() ?? "";
    const mime = attachment.file?.mimeType ?? "";
    return mime === "application/pdf" || name.endsWith(".pdf");
  }, [attachment]);

  const isImage = useMemo(() => {
    if (attachment.type === "file_image") return true;
    const mime = attachment.file?.mimeType ?? "";
    return mime.startsWith("image/");
  }, [attachment]);

  if (isPdf) {
    return (
      <div className="h-[65vh] w-full rounded-lg border">
        <iframe
          title="PDF preview"
          src={streamUrl}
          className="h-full w-full rounded-lg"
        />
      </div>
    );
  }

  if (isImage) {
    return (
      <div className="space-y-3">
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="flat"
            onPress={() => setIsZoomed((value) => !value)}
          >
            {isZoomed ? "Fit to screen" : "Actual size"}
          </Button>
        </div>
        <div
          className="flex max-h-[65vh] justify-center overflow-auto rounded-lg border p-3"
        >
          <img
            src={streamUrl}
            alt={attachment.file?.originalFileName ?? "Attachment"}
            className={`rounded-md ${
              isZoomed
                ? "h-auto w-auto max-w-none max-h-none"
                : "h-auto max-h-[60vh] w-auto max-w-full object-contain"
            }`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 text-center text-sm text-muted-foreground">
      Preview not available — download to view.
    </div>
  );
}
